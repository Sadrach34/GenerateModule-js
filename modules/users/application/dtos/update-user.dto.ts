// update-user.dto.ts
import { IsString, IsInt, IsOptional, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  user?: string;

  @IsOptional()
  @IsInt()
  roleId?: number;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  image?: string;
}
