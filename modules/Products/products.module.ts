import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Connect/prisma.module';
import { ProductController } from './interfaces/controllers/products.controller';
import { CreateProductUseCase } from './application/use-cases/create-products.use-case';
import { GetProductUseCase } from './application/use-cases/get-products.use-case';
import { UpdateProductUseCase } from './application/use-cases/update-products.use-case';
import { SoftDeletedProductUseCase } from './application/use-cases/soft-deleted-products.use-case';
import { ProductRepository } from './domain/repositories/products.repository';
import { ProductPrismaRepository } from './infrastructure/prisma/product.repository';

@Module({
  controllers: [ProductController],
  providers: [
    GetProductUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    SoftDeletedProductUseCase,
    {
      provide: ProductRepository,
      useClass: ProductPrismaRepository,
    },
  ],
  imports: [PrismaModule],
})
export class ProductModule {}
