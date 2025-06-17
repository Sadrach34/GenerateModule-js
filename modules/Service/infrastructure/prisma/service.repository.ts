import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Connect/prisma.service';
import { ServiceRepository } from 'src/modules/service/domain/repositories/service.repository';
import { Service } from 'src/modules/service/domain/entities/service.entity';

@Injectable()
export class ServicePrismaRepository implements ServiceRepository {
  constructor(private prisma: PrismaService) {}

  async create(service: Service): Promise<Service> {
    const created = await this.prisma.service.create({
      data: {
        name: service.name,
        price: service.price,
        duration: service.duration,
        description: service.description || null,
        image: service.image || null,
        teamId: 0, // Campo requerido por Prisma
      },
    });

    return new Service(
      created.id,
      created.name,
      created.price,
      created.duration,
      created.description || undefined,
      created.image || undefined,
    );
  }

  async findAll(): Promise<Service[]> {
    const services = await this.prisma.service.findMany({
      where: { deletedAt: null },
    });

    return services.map(
      (S) =>
        new Service(
          S.id,
          S.name,
          S.price,
          S.duration,
          S.description || undefined,
          S.image || undefined,
        ),
    );
  }

  async findById(id: string): Promise<Service | null> {
    const service = await this.prisma.service.findFirst({
      where: {
        id: Number(id),
        deletedAt: null,
      },
    });

    if (!service) return null;

    return new Service(
      service.id,
      service.name,
      service.price,
      service.duration,
      service.description || undefined,
      service.image || undefined,
    );
  }

  async update(id: string, serviceData: Service): Promise<Service> {
    const updated = await this.prisma.service.update({
      where: { id: Number(id) },
      data: {
        name: serviceData.name,
        price: serviceData.price,
        duration: serviceData.duration,
        description: serviceData.description || null,
        image: serviceData.image || null,
      },
    });

    return new Service(
      updated.id,
      updated.name,
      updated.price,
      updated.duration,
      updated.description || undefined,
      updated.image || undefined,
    );
  }

  async delete(id: string): Promise<Service> {
    const deleted = await this.prisma.service.update({
      where: { id: Number(id) },
      data: {
        deletedAt: new Date(),
      },
    });

    return new Service(
      deleted.id,
      deleted.name,
      deleted.price,
      deleted.duration,
      deleted.description || undefined,
      deleted.image || undefined,
    );
  }

  async findByName(name: string): Promise<Service | null> {
    const service = await this.prisma.service.findFirst({
      where: {
        name,
        deletedAt: null,
      },
    });

    if (!service) return null;

    return new Service(
      service.id,
      service.name,
      service.price,
      service.duration,
      service.description || undefined,
      service.image || undefined,
    );
  }
}
