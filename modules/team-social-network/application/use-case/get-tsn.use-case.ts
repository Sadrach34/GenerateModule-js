import { HttpException, Injectable } from '@nestjs/common';
import { TeamSocialNetwork } from '../../domain/entities/tsn.entity';
import { TeamSocialNetworkRepository } from '../../domain/repositories/tsn.repository';

@Injectable()
export class GetTeamSocialNeworkUseCase {
  constructor(private tsn: TeamSocialNetworkRepository) {}

  async getallTSN(): Promise<TeamSocialNetwork[]> {
    try {
      const tsn = await this.tsn.findAll();

      if (!tsn.length) {
        throw new HttpException(
          { Error: 'No se encontraron redes sociales de equipo' },
          404,
        );
      }

      return tsn;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          Error: `Error al obtener las redes sociales de equipo: ${(error as Error).message}`,
        },
        500,
      );
    }
  }

  async getTSNById(id: number): Promise<TeamSocialNetwork | null> {
    try {
      const tsn = await this.tsn.findById(id.toString());

      if (!tsn) {
        throw new HttpException(
          { Error: 'No se encontró la red social de equipo' },
          404,
        );
      }

      return tsn;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          Error: `Error al obtener la red social de equipo: ${(error as Error).message}`,
        },
        500,
      );
    }
  }
}
