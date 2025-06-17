import { TeamSocialNetwork } from '../entities/tsn.entity';
export abstract class TeamSocialNetworkRepository {
  abstract findAll(): Promise<TeamSocialNetwork[]>;
  abstract findById(id: string): Promise<TeamSocialNetwork | null>;
  abstract createTSN(data: TeamSocialNetwork): Promise<TeamSocialNetwork>;
  abstract updateTSN(
    id: string,
    data: TeamSocialNetwork,
  ): Promise<TeamSocialNetwork>;
  abstract deleteTSN(id: string): Promise<TeamSocialNetwork>;
}
