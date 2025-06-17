import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsNumber()
  id: number;

  @IsNumber()
  serviceId: number;

  @IsString()
  name: string;

  @IsDate()
  entryTime: Date;

  @IsDate()
  departureTime: Date;

  @IsString()
  image: string;
}
