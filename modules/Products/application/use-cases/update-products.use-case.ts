import { Injectable, HttpException } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/products.repository';
import { Products } from '../../domain/entities/product.entity';
import { UpdateProductDto } from '../dtos/update-products.dto';

@Injectable()
export class UpdateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async updateProduct(id: number, data: UpdateProductDto): Promise<Products> {
    try {
      const numericId = Number(id);

      if (isNaN(numericId)) {
        throw new HttpException(
          { Error: 'El id proporcionado no es válido' },
          400,
        );
      }

      const existingProduct = await this.productRepository.findById(numericId); // Usar numericId aquí

      if (!existingProduct) {
        throw new HttpException({ Error: 'El producto no existe' }, 404);
      }

      // Lógica de actualización...
      const updatedProductData = {
        id: numericId,
        name: data.name || existingProduct.name,
        price: data.price !== undefined ? data.price : existingProduct.price,
        stock: data.stock !== undefined ? data.stock : existingProduct.stock,
        expiration:
          data.expiration !== undefined
            ? data.expiration
            : existingProduct.expiration,
        description:
          data.description !== undefined
            ? data.description
            : existingProduct.description,
        image: data.image !== undefined ? data.image : existingProduct.image,
      };

      return this.productRepository.update(numericId, updatedProductData); // Pasar numericId
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          Error: `Error al actualizar el producto: ${(error as Error).message}`,
        },
        500,
      );
    }
  }
}
