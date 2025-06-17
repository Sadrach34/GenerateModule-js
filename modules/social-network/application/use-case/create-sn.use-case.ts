import { HttpException, Injectable } from '@nestjs/common';
import { SocialNetworkRepository } from '../../domain/repositories/sn.repository';
import { SocialNetwork } from '../../domain/entities/sn.entity';
import { CreateSocialNetworkDto } from '../dtos/create-sn.dto';

@Injectable()
export class CreateSocialNetworkUseCase {
  constructor(private socialNetworkRepository: SocialNetworkRepository) {}
  async createSocialnetwork(
    data: CreateSocialNetworkDto,
  ): Promise<SocialNetwork> {
    try {
      const existingSocialNetwork =
        await this.socialNetworkRepository.findByName(data.webPage);

      if (existingSocialNetwork) {
        throw new HttpException(
          {
            Error: `Ya existe una red social con esa página web`,
          },
          409,
        );
      }
      const newSocialNetwork = new SocialNetwork(data.id, data.webPage);

      return this.socialNetworkRepository.create(newSocialNetwork);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          Error: `Error al crear la red social: ${(error as Error).message}`,
        },
        500,
      );
    }
  }
}
