import { Products } from '../entities/product.entity';

export abstract class ProductRepository {
  abstract create(product: Products): Promise<Products>;
  abstract findAll(): Promise<Products[]>;
  abstract findById(id: number): Promise<Products | null>;
  abstract findByName(name: string): Promise<Products | null>;
  abstract update(id: number, product: Products): Promise<Products>;
  abstract delete(id: number): Promise<Products>;
}
