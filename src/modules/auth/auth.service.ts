import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from './dto/signin.dto';
import { RoleEnum } from '../role/enums/role.enum';
import { IJwtPayload } from './jwt-payload.interface';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject('REFRESH_REPOSITORY')
    private readonly refreshRepo?: Repository<RefreshToken>,
  ) {}

  /**
   * Sign in and return both access and refresh tokens.
   * Access token: short lived (15m). Refresh token: longer lived (7d).
   */
  async signin(
    signinDto: SigninDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { username, password } = signinDto;
    const user: User = await this.usersService.findOne(username);
    if (!user) {
      throw new NotFoundException('El usuario no existe');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Contrasena incorrecta');
    }
    if (user.status === 'INACTIVE') {
      throw new BadRequestException('INACTIVE');
    }
    const payload: IJwtPayload = {
      id: user.id,
      username: user.username,
      roles: user.roles.map((r) => r.name as RoleEnum),
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // persist refresh token hash for revocation support
    try {
      if (this.refreshRepo) {
        const tokenHash = await bcrypt.hash(refreshToken, 10);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.refreshRepo.save({
          userId: String(user.id),
          tokenHash,
          expiresAt,
        } as any);
      }
    } catch (e) {
      // non-fatal

      console.warn(
        'Could not persist refresh token:',
        e instanceof Error ? e.message : e,
      );
    }

    return { accessToken, refreshToken };
  }

  /**
   * Given a refresh token, validate and issue a new access token.
   */
  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    // jwtService.verify throws on invalid token
    try {
      const decodedRaw = this.jwtService.verify(refreshToken) as unknown;
      const decoded = decodedRaw as IJwtPayload;
      // basic sanity: ensure id and username exist
      if (!decoded || !decoded.id || !decoded.username) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // If we have a refresh repository, verify that the token exists (hashed) and is not expired
      if (this.refreshRepo) {
        try {
          const candidates = await this.refreshRepo.find({
            where: {
              userId: String(decoded.id),
            },
          });

          const now = new Date();
          let found = false;
          for (const item of candidates) {
            // skip expired entries
            if (item.expiresAt && item.expiresAt < now) {
              continue;
            }
            // compare provided token with stored hash; if match, allow refresh
            // (we intentionally await inside the loop because number of tokens per user is small)
            const match = await bcrypt.compare(refreshToken, item.tokenHash);
            if (match) {
              found = true;
              break;
            }
          }

          if (!found) {
            throw new UnauthorizedException(
              'Refresh token revoked or not found',
            );
          }
        } catch (e) {
          if (e instanceof UnauthorizedException) throw e;
          throw new UnauthorizedException('Could not validate refresh token');
        }
      }

      const payload: IJwtPayload = {
        id: decoded.id,
        username: decoded.username,
        roles: decoded.roles ?? [],
      };

      const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
      return { accessToken };
    } catch {
      // Convert any verification errors to Unauthorized
      throw new UnauthorizedException('Refresh token invalid or expired');
    }
  }

  async revokeRefreshToken(refreshToken: string) {
    if (!this.refreshRepo) return;
    try {
      const all = await this.refreshRepo.find();
      for (const item of all) {
        const match = await bcrypt.compare(refreshToken, item.tokenHash);
        if (match) {
          await this.refreshRepo.delete({ id: item.id });
        }
      }
    } catch {
      // ignore
    }
  }
}
