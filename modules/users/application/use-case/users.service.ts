import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Connect/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.prisma.user.findMany({
        where: { deletedAt: null },
        include: { role: true },
      });
    } catch (error) {
      throw new HttpException(
        {
          Error: `Error intentalo mas tarde. Eror: ${(error as Error).message}`,
        },
        500,
      );
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: {
          id: id,
          deletedAt: null,
        },
        include: { role: true },
      });
    } catch (error) {
      throw new HttpException(
        {
          Error: `Error intentalo mas tarde. Eror: ${(error as Error).message}`,
        },
        500,
      );
    }
  }

  async createUser(data: {
    user: string;
    roleId: number;
    email: string;
    password: string;
    image?: string;
  }): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          user: data.user,
          roleId: data.roleId,
          email: data.email,
          password: data.password,
          image: data.image,
        },
        include: {
          role: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          Error: `Error intentalo mas tarde. Eror: ${(error as Error).message}`,
        },
        500,
      );
    }
  }

  async updateUser(
    id: number,
    data: {
      user?: string;
      roleId?: number;
      email?: string;
      password?: string;
      image?: string;
    },
  ): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          user: data.user,
          roleId: data.roleId,
          email: data.email,
          password: data.password,
          image: data.image,
        },
        include: {
          role: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          Error: `Error intentalo mas tarde. Eror: ${(error as Error).message}`,
        },
        500,
      );
    }
  }

  async deleteUser(id: number): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          Error: `Error intentalo mas tarde. Eror: ${(error as Error).message}`,
        },
        500,
      );
    }
  }
}
