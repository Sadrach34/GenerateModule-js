import {
  IsOptional,
  IsString,
  IsNumber,
  IsDate,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01, { message: 'El precio debe ser mayor a 0' })
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock?: number;

  @IsOptional()
  @IsDate({ message: 'Debe ser una fecha válida' })
  @Type(() => Date) // Para convertir string a Date si viene en el body como string
  expiration?: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;
}
