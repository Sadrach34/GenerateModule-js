import { Module } from '@nestjs/common';
import { SalesService } from './application/use-case/sales.service';
import { SaleController } from './interfaces/controllers/sales.controller';
import { PrismaModule } from 'src/Connect/prisma.module';

@Module({
  controllers: [SaleController],
  providers: [SalesService],
  imports: [PrismaModule],
})
export class SalesModule {}
