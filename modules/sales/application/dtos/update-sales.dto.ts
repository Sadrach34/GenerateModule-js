// update-sale.dto.ts
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsDate,
  IsPositive,
} from 'class-validator';

export class UpdateSaleDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  productId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  userId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  employeeId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  total?: number;

  @IsOptional()
  @IsDate()
  deletedAt?: Date;
}
