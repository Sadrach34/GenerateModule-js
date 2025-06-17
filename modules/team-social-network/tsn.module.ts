import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Connect/prisma.module';
import { teamSocialNetworkController } from './interfaces/controllers/tsn.controller';
import { SoftDeleteTeamSocialNetworkUseCase } from './application/use-case/soft-deleted-tsn.use-case';
import { GetTeamSocialNeworkUseCase } from './application/use-case/get-tsn.use-case';
import { UpdateTeamSocialNetworkUseCase } from './application/use-case/update-tsn.use-case';
import { CreateTeamSocialNetworkUseCase } from './application/use-case/create-tsn.use-case';
import { TeamSocialNetworkRepository } from './domain/repositories/tsn.repository';
import { TeamSocialNetworkprismaRepository } from './infrastructure/prisma/tsn.repository';

@Module({
  controllers: [teamSocialNetworkController],
  providers: [
    GetTeamSocialNeworkUseCase,
    SoftDeleteTeamSocialNetworkUseCase,
    UpdateTeamSocialNetworkUseCase,
    CreateTeamSocialNetworkUseCase,
    {
      provide: TeamSocialNetworkRepository,
      useClass: TeamSocialNetworkprismaRepository,
    },
  ],
  imports: [PrismaModule],
})
export class TeamSocialNetworkModule {}
