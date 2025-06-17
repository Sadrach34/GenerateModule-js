import { HttpException, Injectable } from '@nestjs/common';
import { ServiceRepository } from '../../domain/repositories/service.repository';
import { Service } from '../../domain/entities/service.entity';
import { UpdateServiceDto } from '../dtos/update-service.dto';

@Injectable()
export class UpdateServiceUseCase {
  constructor(private serviceRepository: ServiceRepository) {}

  async updateService(id: number, data: UpdateServiceDto): Promise<Service> {
    try {
      const existingService = await this.serviceRepository.findById(
        id.toString(),
      );

      if (!existingService) {
        throw new HttpException({ Error: 'El servicio no existe' }, 404);
      }

      if (data.price !== undefined && data.price <= 0) {
        throw new HttpException(
          { Error: 'El precio del servicio debe ser mayor a 0' },
          400,
        );
      }

      if (data.duration !== undefined && data.duration <= 0) {
        throw new HttpException(
          { Error: 'La duración del servicio debe ser mayor a 0' },
          400,
        );
      }

      if (data.name) {
        const nameExists = await this.serviceRepository.findByName(data.name);

        if (nameExists && nameExists.id !== id) {
          throw new HttpException(
            { Error: 'Ya existe un servicio con este nombre' },
            400,
          );
        }
      }

      // Crear una nueva instancia de Service con los datos actualizados
      const updatedServiceData = new Service(
        id,
        data.name || existingService.name,
        data.price !== undefined ? data.price : existingService.price,
        data.duration !== undefined ? data.duration : existingService.duration,
        data.description !== undefined
          ? data.description
          : existingService.description,
        data.image !== undefined ? data.image : existingService.image,
      );

      return this.serviceRepository.update(id.toString(), updatedServiceData);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          Error: `Error al actualizar el servicio: ${(error as Error).message}`,
        },
        500,
      );
    }
  }
}
