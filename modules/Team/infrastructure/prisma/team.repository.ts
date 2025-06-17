import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Connect/prisma.service';
import { TeamRepository } from '../../domain/repositories/team.repository';
import { Team } from '../../domain/entities/team.entity';

@Injectable()
export class TeamPrismaRepository implements TeamRepository {
  constructor(private prisma: PrismaService) {}

  async create(team: Team): Promise<Team> {
    const created = await this.prisma.team.create({
      data: {
        serviceId: team.serviceId,
        name: team.name,
        entryTime: team.entryTime,
        departureTime: team.departureTime,
        image: team.image || null,
      },
      include: {
        teamSocialNetworks: true,
      },
    });

    return new Team(
      created.id,
      created.serviceId,
      created.name,
      created.entryTime,
      created.departureTime,
      created.image || undefined,
      created.teamSocialNetworks,
    );
  }

  async findAll(): Promise<Team[]> {
    const teams = await this.prisma.team.findMany({
      where: { deletedAt: null },
      include: {
        teamSocialNetworks: true,
      },
    });

    return teams.map(
      (team) =>
        new Team(
          team.id,
          team.serviceId,
          team.name,
          team.entryTime,
          team.departureTime,
          team.image || undefined,
          team.teamSocialNetworks,
        ),
    );
  }

  async findById(id: string): Promise<Team | null> {
    const team = await this.prisma.team.findFirst({
      where: { id: Number(id) },
      include: {
        teamSocialNetworks: true,
      },
    });

    if (!team) return null;

    return new Team(
      team.id,
      team.serviceId,
      team.name,
      team.entryTime,
      team.departureTime,
      team.image || undefined,
      team.teamSocialNetworks,
    );
  }

  async findByName(name: string): Promise<Team | null> {
    const team = await this.prisma.team.findFirst({
      where: { name, deletedAt: null },
      include: {
        teamSocialNetworks: true,
      },
    });

    if (!team) return null;

    return new Team(
      team.id,
      team.serviceId,
      team.name,
      team.entryTime,
      team.departureTime,
      team.image || undefined,
      team.teamSocialNetworks,
    );
  }

  async update(id: string, team: Team): Promise<Team> {
    const updated = await this.prisma.team.update({
      where: { id: Number(id) },
      data: {
        serviceId: team.serviceId,
        name: team.name,
        entryTime: team.entryTime,
        departureTime: team.departureTime,
        image: team.image || null,
      },
      include: {
        teamSocialNetworks: true,
      },
    });

    return new Team(
      updated.id,
      updated.serviceId,
      updated.name,
      updated.entryTime,
      updated.departureTime,
      updated.image || undefined,
      updated.teamSocialNetworks,
    );
  }

  async delete(id: string): Promise<Team> {
    const deleted = await this.prisma.team.update({
      where: { id: Number(id) },
      data: {
        deletedAt: new Date(),
      },
      include: {
        teamSocialNetworks: true,
      },
    });

    return new Team(
      deleted.id,
      deleted.serviceId,
      deleted.name,
      deleted.entryTime,
      deleted.departureTime,
      deleted.image || undefined,
      deleted.teamSocialNetworks,
    );
  }
}
