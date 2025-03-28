import { Transform } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class GetMessagesDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  pageSize: number;
}
