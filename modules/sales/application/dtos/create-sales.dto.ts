// create-sale.dto.ts
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsDate,
  IsPositive,
} from 'class-validator';

export class CreateSaleDto {
  @IsInt()
  @IsPositive()
  productId: number;

  @IsInt()
  @IsPositive()
  userId: number;

  @IsInt()
  @IsPositive()
  employeeId: number;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  total: number;

  @IsOptional()
  @IsDate()
  deletedAt?: Date;
}
