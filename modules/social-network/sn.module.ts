import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Connect/prisma.module';
import { SocialNetworkController } from './interfaces/controllers/sn.controller';
import { GetSocialNetworkUseCase } from './application/use-case/get-sn.use-case';
import { CreateSocialNetworkUseCase } from './application/use-case/create-sn.use-case';
import { UpdateSocialNetworkUseCase } from './application/use-case/update-sn.use-case';
import { SoftDeletedSocialNetworkUseCase } from './application/use-case/soft-deleted-sn.use-case';
import { SocialNetworkRepository } from './domain/repositories/sn.repository';
import { SnPrismaRepository } from './infrastructure/prisma/sn.repository';

@Module({
  controllers: [SocialNetworkController],
  providers: [
    GetSocialNetworkUseCase,
    CreateSocialNetworkUseCase,
    UpdateSocialNetworkUseCase,
    SoftDeletedSocialNetworkUseCase,
    {
      provide: SocialNetworkRepository,
      useClass: SnPrismaRepository,
    },
  ],
  imports: [PrismaModule],
})
export class SocialNetworkModule {}
