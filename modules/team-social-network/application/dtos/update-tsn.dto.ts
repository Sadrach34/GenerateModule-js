import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateTeamSocialNetworkDto {
  @IsOptional()
  @IsNumber()
  employeeId?: number;

  @IsOptional()
  @IsNumber()
  snetworkId?: number;

  @IsString()
  url?: string;
}
