import { HttpException, Injectable } from '@nestjs/common';
import { TeamSocialNetworkRepository } from '../../domain/repositories/tsn.repository';
import { TeamSocialNetwork } from '../../domain/entities/tsn.entity';
import { UpdateTeamSocialNetworkDto } from '../dtos/update-tsn.dto';

@Injectable()
export class UpdateTeamSocialNetworkUseCase {
  constructor(private teamSocialNetwork: TeamSocialNetworkRepository) {}

  async updateTeam(
    id: number,
    data: UpdateTeamSocialNetworkDto,
  ): Promise<TeamSocialNetwork> {
    try {
      // Verificar si el equipo existe
      const existingTeam = await this.teamSocialNetwork.findById(id.toString());

      if (!existingTeam) {
        throw new HttpException({ Error: 'No se encontró el equipo' }, 404);
      }

      // Actualizar el equipo
      const updatedTsn = new TeamSocialNetwork(
        id,
        data.employeeId || existingTeam.id,
        data.snetworkId || existingTeam.id,
        data.url || existingTeam.url,
      );

      return this.teamSocialNetwork.updateTSN(id.toString(), updatedTsn);
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
