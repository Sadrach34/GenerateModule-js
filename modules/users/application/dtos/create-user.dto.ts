// create-user.dto.ts
import { IsString, IsInt, IsOptional, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  user: string;

  @IsInt()
  roleId: number;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  image?: string;
}
