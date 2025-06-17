import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  teamId: number;

  @IsNumber()
  duration: number;

  @IsString()
  @IsOptional()
  image?: string;
}
