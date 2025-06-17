import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Connect/prisma.module';
import { TeamController } from './interfaces/controllers/team.controller';
import { GetTeamUseCase } from './application/use-case/get-team.use-case';
import { CreateTeamUseCase } from './application/use-case/create-team.use-case';
import { UpdateTeamUseCase } from './application/use-case/update-team.use-case';
import { SoftDeleteTeamUseCase } from './application/use-case/soft-deleted-team.use-case';
import { TeamRepository } from './domain/repositories/team.repository';
import { TeamPrismaRepository } from './infrastructure/prisma/team.repository';

@Module({
  controllers: [TeamController],
  providers: [
    GetTeamUseCase,
    CreateTeamUseCase,
    UpdateTeamUseCase,
    SoftDeleteTeamUseCase,
    {
      provide: TeamRepository,
      useClass: TeamPrismaRepository,
    },
  ],
  imports: [PrismaModule],
})
export class TeamModule {}
