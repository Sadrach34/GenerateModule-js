import { HttpException, Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/products.repository';
import { Products } from '../../domain/entities/product.entity';

@Injectable()
export class SoftDeletedProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async deleteProduct(id: number): Promise<Products> {
    try {
      const product = await this.productRepository.findById(id);

      if (!product) {
        throw new HttpException(
          { Error: 'El producto no existe o fue eliminado' },
          404,
        );
      }

      return await this.productRepository.delete(id);
    } catch (error) {
      throw new HttpException(
        {
          Error: `Error intentalo más tarde. Error: ${(error as Error).message}`,
        },
        500,
      );
    }
  }
}
