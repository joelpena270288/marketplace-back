import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  sender: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  channel?: string; // e.g. storeId, productId or conversation id
}
