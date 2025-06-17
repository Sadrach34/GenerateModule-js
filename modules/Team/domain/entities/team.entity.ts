import { TeamSocialNetwork } from '../../../team-social-network/domain/entities/tsn.entity';

export class Team {
  constructor(
    public id: number,
    public serviceId: number,
    public name: string,
    public entryTime: Date,
    public departureTime: Date,
    public image?: string,
    public teamSocialNetworks?: TeamSocialNetwork[],
  ) {}
}
