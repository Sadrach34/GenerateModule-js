import { HttpException, Injectable } from '@nestjs/common';
import { TeamRepository } from '../../domain/repositories/team.repository';
import { Team } from '../../domain/entities/team.entity';

@Injectable()
export class GetTeamUseCase {
  constructor(private team: TeamRepository) {}

  async getallTeam(): Promise<Team[]> {
    try {
      const teams = await this.team.findAll();

      if (!teams.length) {
        throw new HttpException(
          { Error: 'No se encontraron redes sociales' },
          404,
        );
      }

      return teams;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          Error: `Error al obtener los equipos: ${(error as Error).message}`,
        },
        500,
      );
    }
  }

  async getTeamById(id: number): Promise<Team | null> {
    try {
      const team = await this.team.findById(id.toString());

      if (!team) {
        throw new HttpException({ Error: 'No se encontró el equipo' }, 404);
      }

      return team;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          Error: `Error al obtener el empleado del equipo: ${(error as Error).message}`,
        },
        500,
      );
    }
  }
}
