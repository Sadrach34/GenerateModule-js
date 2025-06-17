import { HttpException, Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/products.repository';
import { Products } from '../../domain/entities/product.entity';
import { CreateProductDto } from '../dtos/create-products.dto';

@Injectable()
export class CreateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async createProduct(data: CreateProductDto): Promise<Products> {
    try {
      // Validación de existencia previa (opcional)
      const existingProduct = await this.productRepository.findByName(
        data.name,
      );
      if (existingProduct) {
        throw new HttpException(
          { Error: 'Ya existe un producto con este nombre' },
          400,
        );
      }

      // Crear entidad
      const newProduct = new Products(
        0,
        data.name,
        data.price,
        data.stock,
        data.expiration,
        data.description,
        data.image,
      );

      // Delegar al repositorio
      return await this.productRepository.create(newProduct);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        { Error: `Error al crear el producto: ${(error as Error).message}` },
        500,
      );
    }
  }
}
