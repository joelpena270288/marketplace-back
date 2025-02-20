import { Type, Exclude, Expose } from 'class-transformer';
import { IsNumber, IsEmail, IsString, IsDate } from 'class-validator';
import { ReadRolDto } from '../../role/dto/read-role-dto';
import { UserDetails } from '../user.details.entity';

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
  @Type((type) => ReadRolDto)
  roles: ReadRolDto[];
  @Expose()
  @IsString()
  status: string;
  @Expose()
  @IsDate()
  createdAt: Date;
  @Expose()
  @IsDate()
  updatedAt: Date;
}
