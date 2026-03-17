import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ConfigService } from './config.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../role/guards/roles.guard';
import { HasRoles } from '../role/roles.decorator';
import { RoleEnum } from '../role/enums/role.enum';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('mission')
  getMission() {
    return this.configService.getConfig('mission');
  }

  @Get('vision')
  getVision() {
    return this.configService.getConfig('vision');
  }

  @HasRoles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('mission')
  updateMission(@Body() data: { content: string }) {
    return this.configService.updateConfig('mission', data.content);
  }

  @HasRoles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('vision')
  updateVision(@Body() data: { content: string }) {
    return this.configService.updateConfig('vision', data.content);
  }
}
