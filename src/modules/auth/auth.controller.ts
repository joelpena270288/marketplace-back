/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';

import { SigninDto } from './dto/signin.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
 
  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }
  /*
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }*/
}
