import { Team } from '../entities/team.entity';

export abstract class TeamRepository {
  abstract create(team: Team): Promise<Team>;
  abstract findAll(): Promise<Team[]>;
  abstract findById(id: string): Promise<Team | null>;
  abstract findByName(name: string): Promise<Team | null>;
  abstract update(id: string, team: Team): Promise<Team>;
  abstract delete(id: string): Promise<Team>;
}
