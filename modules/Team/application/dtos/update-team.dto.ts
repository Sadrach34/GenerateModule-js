import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class TeamSocialNetworkDto {
  @IsNumber()
  @IsOptional()
  snetworkId: number;

  @IsString()
  @IsOptional()
  url: string;
}

export class UpdateTeamDto {
  @IsNumber()
  @IsOptional()
  serviceId: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsDate()
  @IsOptional()
  entryTime: Date;

  @IsDate()
  @IsOptional()
  departureTime: Date;

  @IsString()
  @IsOptional()
  image: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamSocialNetworkDto)
  teamSocialNetworks: TeamSocialNetworkDto[];
}
