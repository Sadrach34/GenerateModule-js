import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Connect/prisma.service';
import { TeamSocialNetworkRepository } from '../../domain/repositories/tsn.repository';
import { TeamSocialNetwork } from '../../domain/entities/tsn.entity';

@Injectable()
export class TeamSocialNetworkprismaRepository
  implements TeamSocialNetworkRepository
{
  constructor(private prisma: PrismaService) {}

  async createTSN(data: TeamSocialNetwork): Promise<TeamSocialNetwork> {
    try {
      // Verificar que los IDs sean números válidos
      if (!data.employeeId || !data.snetworkId) {
        throw new Error('Los IDs de equipo y red social son obligatorios');
      }

      const createdTsn = await this.prisma.teamSocialNetwork.create({
        data: {
          employeeId: data.employeeId,
          snetworkId: data.snetworkId,
          url: data.url,
        },
      });

      return new TeamSocialNetwork(
        createdTsn.id,
        createdTsn.employeeId,
        createdTsn.snetworkId,
        createdTsn.url,
      );
    } catch (error) {
      // Verificación segura del tipo de error y sus propiedades
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const errorWithMessage = error as { message: string };
        if (errorWithMessage.message.includes('Foreign key constraint')) {
          throw new Error(
            'Error de clave foránea: Verifica que los IDs de equipo y red social existan',
          );
        }
      }
      // Manejo de errores conocidos
      if (error instanceof Error) {
        throw error;
      }
      // Manejo de errores desconocidos
      throw new Error('Error desconocido al crear la red social del equipo');
    }
  }

  async updateTSN(
    id: string,
    data: TeamSocialNetwork,
  ): Promise<TeamSocialNetwork> {
    const updatedTsn = await this.prisma.teamSocialNetwork.update({
      where: { id: Number(id) },
      data: {
        url: data.url,
      },
    });

    return new TeamSocialNetwork(
      updatedTsn.id,
      updatedTsn.employeeId,
      updatedTsn.snetworkId,
      updatedTsn.url,
    );
  }

  async findById(id: string): Promise<TeamSocialNetwork | null> {
    const teamSocialNetwork = await this.prisma.teamSocialNetwork.findFirst({
      where: { id: Number(id) },
    });

    if (!teamSocialNetwork) return null;

    return new TeamSocialNetwork(
      teamSocialNetwork.id,
      teamSocialNetwork.employeeId,
      teamSocialNetwork.snetworkId,
      teamSocialNetwork.url,
    );
  }
  async findAll(): Promise<TeamSocialNetwork[]> {
    const teamSocialNetwork = await this.prisma.teamSocialNetwork.findMany();

    return teamSocialNetwork.map(
      (tsn) =>
        new TeamSocialNetwork(tsn.id, tsn.employeeId, tsn.snetworkId, tsn.url),
    );
  }

  async deleteTSN(id: string): Promise<TeamSocialNetwork> {
    const deleted = await this.prisma.teamSocialNetwork.update({
      where: { id: Number(id) },
      data: {
        deletedAt: new Date(),
      },
    });

    return new TeamSocialNetwork(
      deleted.id,
      deleted.employeeId,
      deleted.snetworkId,
      deleted.url,
    );
  }
}
