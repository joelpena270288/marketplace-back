import { Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  ParseUUIDPipe,
  Req, 
  Query,
  BadRequestException} from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';


import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleEnum } from '../role/enums/role.enum';
import { RolesGuard } from '../role/guards/roles.guard';

import { HasRoles } from '../role/roles.decorator';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/user.decorator';
import { User } from './entities/user.entity';
import { use } from 'passport';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
 
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @HasRoles(RoleEnum.ADMIN, RoleEnum.EDITOR,RoleEnum.ESTANDAR,RoleEnum.PREMIUN,RoleEnum.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @HasRoles(RoleEnum.ADMIN,RoleEnum.EDITOR,RoleEnum.ESTANDAR,RoleEnum.PREMIUN,RoleEnum.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/username')
  findByUsername(@GetUser() user: User) {
    return this.usersService.findOneByUsername(user.username);
  }
 
  @HasRoles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
  @Get('check-exists')
  async checkUserExists(
    @Query('username') username: string,
    @Query('email') email: string,
  ) {
    if (!username || !email) {
      throw new BadRequestException('Se requieren username y email');
    }

    return await this.usersService.checkUserExists(username, email);
  }
}
