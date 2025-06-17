import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Connect/prisma.module';
import { ServiceController } from './interfaces/controllers/service.controller';
import { GetServicesUseCase } from './application/use-case/get-service.use-case';
import { CreateServiceUseCase } from './application/use-case/create-service.use-case';
import { UpdateServiceUseCase } from './application/use-case/update-service.use-case';
import { SoftDeletedServiceUseCase } from './application/use-case/soft-deleted-service.use-case';
import { ServiceRepository } from './domain/repositories/service.repository';
import { ServicePrismaRepository } from './infrastructure/prisma/service.repository';

@Module({
  controllers: [ServiceController],
  providers: [
    GetServicesUseCase,
    CreateServiceUseCase,
    UpdateServiceUseCase,
    SoftDeletedServiceUseCase,
    {
      provide: ServiceRepository,
      useClass: ServicePrismaRepository,
    },
  ],
  imports: [PrismaModule],
})
export class ServiceModule {}
