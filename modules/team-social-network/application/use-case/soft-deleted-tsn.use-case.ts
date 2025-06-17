import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../Connect/prisma.service';
import { TeamSocialNetwork } from '@prisma/client';

@Injectable()
export class SoftDeleteTeamSocialNetworkUseCase {
  constructor(private prisma: PrismaService) {}

  async deleteTSN(id: number): Promise<TeamSocialNetwork> {
    try {
      return this.prisma.teamSocialNetwork.update({
        where: {
          id: id,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          Error: `Error, inténtalo más tarde. Error: ${(error as Error).message}`,
        },
        500,
      );
    }
  }
}
