import { HttpException, Injectable } from '@nestjs/common';
import { SocialNetworkRepository } from '../../domain/repositories/sn.repository';
import { SocialNetwork } from '../../domain/entities/sn.entity';

@Injectable()
export class GetSocialNetworkUseCase {
  constructor(private socialNetwork: SocialNetworkRepository) {}
  async getallSocialnetwork(): Promise<SocialNetwork[]> {
    try {
      const sn = await this.socialNetwork.findAll();

      if (!sn.length) {
        throw new HttpException({ Error: `No existen redes sociales` }, 404);
      }

      return sn;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          Error: `Error al obtener las redes socialess: ${(error as Error).message}`,
        },
        500,
      );
    }
  }

  async getSocialnetworkById(id: number): Promise<SocialNetwork | null> {
    try {
      const sn = await this.socialNetwork.findById(id.toString());

      if (!sn) {
        throw new HttpException({ Error: `No existe la red social` }, 404);
      }

      return sn;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          Error: `Error al obtener la redes sociales: ${(error as Error).message}`,
        },
        500,
      );
    }
  }
}
