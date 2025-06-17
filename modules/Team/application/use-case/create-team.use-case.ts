import { HttpException, Injectable } from '@nestjs/common';
import { TeamRepository } from '../../domain/repositories/team.repository';
import { Team } from '../../domain/entities/team.entity';
import { CreateTeamDto } from '../dtos/create-team.dto';

@Injectable()
export class CreateTeamUseCase {
  constructor(private team: TeamRepository) {}

  async createTeam(data: CreateTeamDto): Promise<Team> {
    try {
      const existingTeamSn = await this.team.findByName(data.name);

      if (existingTeamSn) {
        throw new HttpException(
          { Error: 'Ya existe un equipo con este nombre' },
          409,
        );
      }

      const newTeam = new Team(
        0,
        data.serviceId,
        data.name,
        data.entryTime,
        data.departureTime,
        data.image,
      );

      return await this.team.create(newTeam);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          Error: `Error al crear el equipo: ${(error as Error).message}`,
        },
        500,
      );
    }
  }
}
