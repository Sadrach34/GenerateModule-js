import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Connect/prisma.service';
import { ProductRepository } from 'src/modules/products/domain/repositories/products.repository';
import { Products } from 'src/modules/products/domain/entities/product.entity';

@Injectable()
export class ProductPrismaRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(product: Products): Promise<Products> {
    const created = await this.prisma.product.create({
      data: {
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description || null,
        deletedAt: null,
        expiration: product.expiration,
        image: product.image,
      },
    });
    return new Products(
      created.id,
      created.name,
      created.price,
      created.stock,
      created.expiration,
      created.description || undefined,
      created.image || undefined,
    );
  }

  async findAll(): Promise<Products[]> {
    const products = await this.prisma.product.findMany({
      where: { deletedAt: null },
    });

    return products.map(
      (P) =>
        new Products(
          P.id,
          P.name,
          P.price,
          P.stock,
          P.expiration,
          P.description || undefined,
          P.image || undefined,
        ),
    );
  }
  async findById(id: number): Promise<Products | null> {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
    if (!product) return null;
    return new Products(
      product.id,
      product.name,
      product.price,
      product.stock,
      product.expiration,
      product.description || undefined,
      product.image || undefined,
    );
  }
  async update(id: number, product: Products): Promise<Products> {
    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description,
        expiration: product.expiration,
        image: product.image,
      },
    });
    return new Products(
      updated.id,
      updated.name,
      updated.price,
      updated.stock,
      updated.expiration,
      updated.description || undefined,
      updated.image || undefined,
    );
  }
  async delete(id: number): Promise<Products> {
    const deleted = await this.prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
    return new Products(
      deleted.id,
      deleted.name,
      deleted.price,
      deleted.stock,
      deleted.expiration,
      deleted.description || undefined,
      deleted.image || undefined,
    );
  }
  async findByName(name: string): Promise<Products | null> {
    const product = await this.prisma.product.findFirst({
      where: {
        name,
        deletedAt: null,
      },
    });
    if (!product) return null;
    return new Products(
      product.id,
      product.name,
      product.price,
      product.stock,
      product.expiration,
      product.description || undefined,
      product.image || undefined,
    );
  }
}
