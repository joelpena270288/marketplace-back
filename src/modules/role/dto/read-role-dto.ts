import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';
export class ReadRolDto {
  @Exclude()
  @IsString()
  readonly id: string;
  @Expose()
  @IsString()
  name: string;
  @Expose()
  @IsString()
  descripcion: string;
}
