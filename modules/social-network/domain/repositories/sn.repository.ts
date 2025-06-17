import { SocialNetwork } from '../entities/sn.entity';

export abstract class SocialNetworkRepository {
  abstract create(socialNetwork: SocialNetwork): Promise<SocialNetwork>;
  abstract findAll(): Promise<SocialNetwork[]>;
  abstract findById(id: string): Promise<SocialNetwork | null>;
  abstract findByName(webpage: string): Promise<SocialNetwork | null>;
  abstract update(id: string, sn: SocialNetwork): Promise<SocialNetwork>;
  abstract delete(id: string): Promise<SocialNetwork>;
}
