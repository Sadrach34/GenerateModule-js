import { HttpException, Injectable } from '@nestjs/common';
import { SocialNetworkRepository } from '../../domain/repositories/sn.repository';
import { SocialNetwork } from '../../domain/entities/sn.entity';
import { UpdateSocialNetworkDto } from '../dtos/update-sn.dto';

@Injectable()
export class UpdateSocialNetworkUseCase {
  constructor(private socialNetwork: SocialNetworkRepository) {}

  async updateSocialnetwork(
    id: number,
    data: UpdateSocialNetworkDto,
  ): Promise<SocialNetwork> {
    try {
      const existingSocialNetwork = await this.socialNetwork.findById(
        id.toString(),
      );

      if (!existingSocialNetwork) {
        throw new HttpException({ Error: `No existe la red social` }, 404);
      }

      if (data.webPage) {
        const existingSocialNetwork = await this.socialNetwork.findByName(
          data.webPage,
        );

        if (existingSocialNetwork) {
          throw new HttpException(
            { Error: `Ya existe una red social con ese nombre` },
            409,
          );
        }
      }

      const upsatedSocialNetwork = new SocialNetwork(
        id,
        data.webPage || existingSocialNetwork.webPage,
      );

      return this.socialNetwork.update(id.toString(), upsatedSocialNetwork);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          Error: `Error al actualizar la red social: ${(error as Error).message}`,
        },
        500,
      );
    }
  }
}
