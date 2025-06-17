import { HttpException, Injectable } from '@nestjs/common';
import { ServiceRepository } from '../../domain/repositories/service.repository';
import { Service } from '../../domain/entities/service.entity';

@Injectable()
export class SoftDeletedServiceUseCase {
  constructor(private serviceRepository: ServiceRepository) {}

  async deleteService(id: number): Promise<Service> {
    try {
      const service = await this.serviceRepository.delete(id.toString());

      if (!service) {
        throw new HttpException(
          { Error: 'El servicio no existe o fue eliminado' },
          404,
        );
      }
      return service;
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
