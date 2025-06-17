import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTeamSocialNetworkDto {
  @IsNotEmpty()
  @IsNumber()
  employeeId: number;

  @IsNotEmpty()
  @IsNumber()
  snetworkId: number;

  @IsNotEmpty()
  @IsString()
  url: string;
}
