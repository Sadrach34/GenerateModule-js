import { HttpException, Injectable } from '@nestjs/common';
import { TeamRepository } from '../../domain/repositories/team.repository';
import { Team } from '../../domain/entities/team.entity';

@Injectable()
export class SoftDeleteTeamUseCase {
  constructor(private team: TeamRepository) {}

  async deleteTeam(id: number): Promise<Team> {
    try {
      const team = await this.team.delete(id.toString());

      if (!team) {
        throw new HttpException(
          { Error: 'El equipo no existe o fue eliminado' },
          404,
        );
      }

      return team;
    } catch (error) {
      throw new HttpException(
        {
          Error: `Error intentalo mas tarde. Eror: ${(error as Error).message}`,
        },
        500,
      );
    }
  }
}
