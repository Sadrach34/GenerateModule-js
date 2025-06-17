import { IsOptional, IsString } from 'class-validator';

export class UpdateSocialNetworkDto {
  @IsString()
  @IsOptional()
  webPage: string;
}
