import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';

import { DatabaseModule } from '../../database/database.module';
import { RoleProviders } from './role.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [RoleController],
  providers: [RoleService, ...RoleProviders
    ],
    exports:[RoleService]
})
export class RoleModule {}
