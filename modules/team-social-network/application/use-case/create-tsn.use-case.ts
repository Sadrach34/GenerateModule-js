import { HttpException, Injectable } from '@nestjs/common';
import { TeamSocialNetworkRepository } from '../../domain/repositories/tsn.repository';
import { TeamSocialNetwork } from '../../domain/entities/tsn.entity';
import { CreateTeamSocialNetworkDto } from '../dtos/create-tsn.dto';
import { PrismaService } from 'src/Connect/prisma.service';

@Injectable()
export class CreateTeamSocialNetworkUseCase {
  constructor(
    private teamSocialNetwork: TeamSocialNetworkRepository,
    private prisma: PrismaService,
  ) {}

  async createTeam(
    data: CreateTeamSocialNetworkDto,
  ): Promise<TeamSocialNetwork> {
    try {
      // Verificar si el equipo (employee) existe
      const employeeExists = await this.prisma.team.findUnique({
        where: { id: data.employeeId },
      });

      if (!employeeExists) {
        throw new HttpException(
          { Error: `El equipo con ID ${data.employeeId} no existe` },
          404,
        );
      }

      // Verificar si la red social existe
      const socialNetworkExists = await this.prisma.socialNetwork.findUnique({
        where: { id: data.snetworkId },
      });

      if (!socialNetworkExists) {
        throw new HttpException(
          { Error: `La red social con ID ${data.snetworkId} no existe` },
          404,
        );
      }

      const newTsn = new TeamSocialNetwork(
        0,
        data.employeeId,
        data.snetworkId,
        data.url,
      );

      return await this.teamSocialNetwork.createTSN(newTsn);
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
