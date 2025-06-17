import { HttpException, Injectable } from '@nestjs/common';
import { ServiceRepository } from '../../domain/repositories/service.repository';
import { Service } from '../../domain/entities/service.entity';

@Injectable()
export class GetServicesUseCase {
  constructor(private serviceRepository: ServiceRepository) {}

  async getallService(): Promise<Service[]> {
    try {
      const services = await this.serviceRepository.findAll();

      if (!services.length) {
        throw new HttpException({ Error: 'No hay servicios disponibles' }, 404);
      }

      return services;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          Error: `Error al obtener los servicios: ${(error as Error).message}`,
        },
        500,
      );
    }
  }

  async getByIdService(id: number): Promise<Service> {
    try {
      const service = await this.serviceRepository.findById(id.toString());

      if (!service) {
        throw new HttpException(
          { Error: 'El servicio no existe o fue eliminado' },
          404,
        );
      }

      return service;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          Error: `Error al obtener el servicio: ${(error as Error).message}`,
        },
        500,
      );
    }
  }
}
