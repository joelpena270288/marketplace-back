import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserProviders } from './user.providers';
import { DatabaseModule } from '../../database/database.module';
import { RoleProviders } from '../role/role.providers';


@Module({
  imports: [DatabaseModule],
  providers: [...UserProviders, UsersService, ...RoleProviders],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
