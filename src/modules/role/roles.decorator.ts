import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from './enums/role.enum';
export const HasRoles = (...roles: RoleEnum[]) => SetMetadata('roles', roles);