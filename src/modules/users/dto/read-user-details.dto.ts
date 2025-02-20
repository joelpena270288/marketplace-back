import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';
Exclude();
export class ReadDetailsDto {
  @Expose()
  @IsString()
  readonly name: string;
  @Expose()
  @IsString()
  readonly lastname: string;
  @Expose()
  @IsString()
  readonly email: string;
}