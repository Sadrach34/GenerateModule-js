import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from '../../../../Connect/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async getAllRoles(): Promise<Role[]> {
    try {
      return await this.prisma.role.findMany({
        where: { deletedAt: null },
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

  async getRoleById(id: number): Promise<Role | null> {
    try {
      return await this.prisma.role.findUnique({
        where: {
          id: id,
          deletedAt: null,
        },
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

  async createRole(data: { role: string }): Promise<Role> {
    try {
      return await this.prisma.role.create({
        data: {
          role: data.role,
        },
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

  async updateRole(id: number, data: { role: string }): Promise<Role> {
    try {
      return await this.prisma.role.update({
        where: { id },
        data: {
          role: data.role,
        },
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

  async deleteRole(id: number): Promise<Role> {
    try {
      return await this.prisma.role.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
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
