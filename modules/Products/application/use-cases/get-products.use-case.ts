import { HttpException, Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/products.repository';
import { Products } from '../../domain/entities/product.entity';

@Injectable()
export class GetProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async getAllProducts(): Promise<Products[]> {
    try {
      const products = await this.productRepository.findAll();

      if (!products.length) {
        throw new HttpException({ Error: 'No hay productos disponibles' }, 404);
      }

      return products;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          Error: `Error al obtener los productos: ${(error as Error).message}`,
        },
        500,
      );
    }
  }

  async getProductById(id: number): Promise<Products> {
    try {
      // Asegúrate de que id sea un número
      const numericId = Number(id); // Esto convierte a número si es una cadena

      if (isNaN(numericId)) {
        throw new HttpException(
          { Error: 'El id proporcionado no es válido' },
          400,
        );
      }

      // Llamamos al repositorio, pasando un número como id
      const product = await this.productRepository.findById(numericId);

      if (!product) {
        throw new HttpException(
          { Error: 'El producto no existe o fue eliminado' },
          404,
        );
      }

      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          Error: `Error al obtener el producto: ${(error as Error).message}`,
        },
        500,
      );
    }
  }
}
