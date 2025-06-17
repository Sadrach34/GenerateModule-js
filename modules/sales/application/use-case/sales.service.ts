// sales.service.ts
import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/Connect/prisma.service';
import { CreateSaleDto } from '../dtos/create-sales.dto';
import { UpdateSaleDto } from '../dtos/update-sales.dto';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async createSales(data: CreateSaleDto) {
    try {
      return await this.prisma.sale.create({ data });
    } catch (error) {
      throw new HttpException(
        {
          Error: `Error intentalo más tarde. Error: ${(error as Error).message}`,
        },
        500,
      );
    }
  }

  async getAllSales() {
    try {
      return await this.prisma.sale.findMany({
        where: { deletedAt: null },
        include: { employee: true, product: true, user: true },
      });
    } catch (error) {
      throw new HttpException(
        {
          Error: `Error intentalo más tarde. Error: ${(error as Error).message}`,
        },
        500,
      );
    }
  }

  async getSaleById(id: number) {
    try {
      return await this.prisma.sale.findUnique({
        where: { id: id, deletedAt: null },
        include: { employee: true, product: true, user: true },
      });
    } catch (error) {
      throw new HttpException(
        {
          Error: `Error intentalo más tarde. Error: ${(error as Error).message}`,
        },
        500,
      );
    }
  }

  async updateSale(id: number, data: UpdateSaleDto) {
    try {
      return await this.prisma.sale.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new HttpException(
        {
          Error: `Error intentalo más tarde. Error: ${(error as Error).message}`,
        },
        500,
      );
    }
  }

  async deleteSale(id: number) {
    try {
      return await this.prisma.sale.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
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
