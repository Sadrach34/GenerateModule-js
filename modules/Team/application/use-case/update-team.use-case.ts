import { HttpException, Injectable } from '@nestjs/common';
import { TeamRepository } from '../../domain/repositories/team.repository';
import { Team } from '../../domain/entities/team.entity';
import { UpdateTeamDto } from '../dtos/update-team.dto';

@Injectable()
export class UpdateTeamUseCase {
  constructor(private team: TeamRepository) {}

  async updateTeam(id: number, data: UpdateTeamDto): Promise<Team> {
    try {
      // Verificar si el equipo existe
      const existingTeam = await this.team.findById(id.toString());

      if (!existingTeam) {
        throw new HttpException({ Error: 'No se encontró el equipo' }, 404);
      }

      if (data.name) {
        const existingTeam = await this.team.findByName(data.name);

        if (existingTeam) {
          throw new HttpException(
            { Error: 'Ya existe un equipo con este nombre' },
            409,
          );
        }
      }

      // Actualizar el equipo
      const updatedTeam = new Team(
        id,
        data.serviceId,
        data.name || existingTeam.name,
        data.entryTime,
        data.departureTime,
        data.image,
      );

      return this.team.update(id.toString(), updatedTeam);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          Error: `Error al actualizar el empleado: ${(error as Error).message}`,
        },
        500,
      );
    }
  }
}
