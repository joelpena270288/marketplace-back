import { RoleEnum } from '../role/enums/role.enum';

export interface IJwtPayload {
  id: string;
  username: string;

  roles: RoleEnum[];
  iat?: Date;
}