// create-product.dto.ts
import { IsString, IsNumber, IsOptional, IsDate, IsInt } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  stock: number;

  @IsDate()
  expiration: Date;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsDate()
  deletedAt?: Date;

  // El campo 'createdAt' y 'updatedAt' generalmente son gestionados por Prisma, por lo que no deberían incluirse en el DTO
}
