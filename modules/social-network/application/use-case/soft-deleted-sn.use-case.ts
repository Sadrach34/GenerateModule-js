import { HttpException, Injectable } from '@nestjs/common';
import { SocialNetworkRepository } from '../../domain/repositories/sn.repository';
import { SocialNetwork } from '../../domain/entities/sn.entity';

@Injectable()
export class SoftDeletedSocialNetworkUseCase {
  constructor(private socialNetwork: SocialNetworkRepository) {}

  async deleteSocialnetwork(id: number): Promise<SocialNetwork> {
    try {
      const snDeleted = await this.socialNetwork.delete(id.toString());

      if (!snDeleted) {
        throw new HttpException(
          { Error: 'La red social no existe o fue eliminada' },
          404,
        );
      }

      return snDeleted;
    } catch (error) {
      throw new HttpException(
        {
          Error: `Error, inténtalo más tarde. Error: ${(error as Error).message}`,
        },
        500,
      );
    }
  }
}
