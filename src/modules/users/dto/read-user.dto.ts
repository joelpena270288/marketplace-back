import { Type, Exclude, Expose } from 'class-transformer';
import { IsNumber, IsEmail, IsString, IsDate } from 'class-validator';
import { ReadRolDto } from '../../role/dto/read-role-dto';
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
  @Type((type) => UserDetails)
  details: UserDetails;
  @Expose()
  @Type((type) => Role)
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
