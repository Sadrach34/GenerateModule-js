import { HttpException, Injectable } from '@nestjs/common';
import { ServiceRepository } from '../../domain/repositories/service.repository';
import { Service } from '../../domain/entities/service.entity';
import { CreateServiceDto } from '../dtos/create-service.dto';

@Injectable()
export class CreateServiceUseCase {
  constructor(private serviceRepository: ServiceRepository) {}

  async createService(data: CreateServiceDto): Promise<Service> {
    try {
      if (data.price <= 0) {
        throw new HttpException(
          { Error: 'El precio del servicio debe ser mayor a 0' },
          400,
        );
      }

      if (data.duration <= 0) {
        throw new HttpException(
          { Error: 'La duración del servicio debe ser mayor a 0' },
          400,
        );
      }

      // Buscar todos los servicios y filtrar por nombre
      const services = await this.serviceRepository.findAll();
      const existingService = services.find(
        (service) => service.name === data.name,
      );

      if (existingService) {
        throw new HttpException(
          { Error: 'Ya existe un servicio con este nombre' },
          400,
        );
      }

      // Crear una nueva instancia de Service con los datos del DTO
      const newService = new Service(
        0, // El ID se generará automáticamente por la base de datos
        data.name,
        data.price,
        data.duration,
        data.description,
        data.image,
      );

      // Usar el método create del repositorio
      return this.serviceRepository.create(newService);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          Error: `Error al crear el servicio: ${(error as Error).message}`,
        },
        500,
      );
    }
  }
}
