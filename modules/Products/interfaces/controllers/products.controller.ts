import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateProductUseCase } from '../../application/use-cases/create-products.use-case';
import { GetProductUseCase } from '../../application/use-cases/get-products.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/update-products.use-case';
import { SoftDeletedProductUseCase } from '../../application/use-cases/soft-deleted-products.use-case';
import { CreateProductDto } from '../../application/dtos/create-products.dto';
import { UpdateProductDto } from '../../application/dtos/update-products.dto';
import { Product } from '@prisma/client';
import { Products } from '../../domain/entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(
    private readonly Get: GetProductUseCase,
    private readonly created: CreateProductUseCase,
    private readonly updated: UpdateProductUseCase,
    private readonly deleted: SoftDeletedProductUseCase,
  ) {}

  @Get()
  async getAllProducts(): Promise<Products[]> {
    return this.Get.getAllProducts();
  }

  @Get(':id')
  async getProductById(@Param('id') id: number): Promise<Products | null> {
    return this.Get.getProductById(id);
  }

  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Products> {
    return this.created.createProduct(createProductDto);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Products> {
    return this.updated.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: number): Promise<Products> {
    return this.deleted.deleteProduct(id);
  }
}
