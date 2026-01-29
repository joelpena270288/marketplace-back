import { Type, Exclude, Expose } from 'class-transformer';
import { IsString, IsDate } from 'class-validator';
import { UserDetails } from '../user.details.entity';
import { Role } from '../../role/entities/role.entity';

export class ReadUserDto {
  @Expose()
  @IsString()
  readonly id: string;
  @Expose()
  @IsString()
  username: string;
  @Exclude()
  @IsString()
  password: string;
  @Expose()
  @Type(() => UserDetails)
  details: UserDetails;
  @Expose()
  @Type(() => Role)
  roles: Role[];
  @Expose()
  @IsString()
  status: string;
  @Exclude()
  @IsDate()
  createdAt: Date;
  @Exclude()
  @IsDate()
  updatedAt: Date;
  @Exclude()
  online: boolean;
  @Exclude()
  userId: string;
}
