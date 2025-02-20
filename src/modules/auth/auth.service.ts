import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from './dto/signin.dto';
import { RoleEnum } from '../role/enums/role.enum';
import { IJwtPayload } from './jwt-payload.interface';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signin(signinDto: SigninDto): Promise<{ token: string }> {
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

    const token = this.jwtService.sign(payload);
    return { token };
  }
}
