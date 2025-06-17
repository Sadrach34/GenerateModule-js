import { Service } from '../entities/service.entity';

export abstract class ServiceRepository {
  abstract create(service: Service): Promise<Service>;
  abstract findAll(): Promise<Service[]>;
  abstract findById(id: string): Promise<Service | null>;
  abstract findByName(name: string): Promise<Service | null>;
  abstract update(id: string, service: Service): Promise<Service>;
  abstract delete(id: string): Promise<Service>;
}
