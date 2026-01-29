/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';

import { SigninDto } from './dto/signin.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  async login(
    @Body() signinDto: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signin(signinDto);
    // Set refresh token as HttpOnly cookie
    const cookieOptions = {
      httpOnly: true,
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
    };
    res.cookie('refresh', result.refreshToken, cookieOptions);
    return { accessToken: result.accessToken };
  }

  @Post('refresh')
  @UsePipes(ValidationPipe)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body?: RefreshDto,
  ) {
    // try cookie first, fallback to body
    const rawCookies = (req as unknown as { cookies?: Record<string, unknown> })
      .cookies;
    let token: string | undefined;
    if (rawCookies && typeof rawCookies.refresh === 'string') {
      token = rawCookies.refresh;
    } else if (body?.refreshToken && typeof body.refreshToken === 'string') {
      token = body.refreshToken;
    }
    if (!token) {
      throw new Error('No refresh token provided');
    }
    const { accessToken } = await this.authService.refresh(token);
    return { accessToken };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rawCookies2 = (
      req as unknown as { cookies?: Record<string, unknown> }
    ).cookies;
    const token =
      rawCookies2 && typeof rawCookies2.refresh === 'string'
        ? rawCookies2.refresh
        : undefined;
    if (token) {
      await this.authService.revokeRefreshToken(token);
    }
    res.clearCookie('refresh');
    return { ok: true };
  }
  /*
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }*/
}
