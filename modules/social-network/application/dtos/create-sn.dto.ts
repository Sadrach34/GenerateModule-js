import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSocialNetworkDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  webPage: string;
}
