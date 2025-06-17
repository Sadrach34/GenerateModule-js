import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Connect/prisma.service';
import { SocialNetworkRepository } from '../../domain/repositories/sn.repository';
import { SocialNetwork } from '../../domain/entities/sn.entity';

@Injectable()
export class SnPrismaRepository implements SocialNetworkRepository {
  constructor(private prisma: PrismaService) {}

  async create(socialNetwork: SocialNetwork): Promise<SocialNetwork> {
    const created = await this.prisma.socialNetwork.create({
      data: {
        webPage: socialNetwork.webPage,
      },
    });

    return new SocialNetwork(created.id, created.webPage);
  }

  async findAll(): Promise<SocialNetwork[]> {
    const socialNetworks = await this.prisma.socialNetwork.findMany();

    return socialNetworks.map((sn) => new SocialNetwork(sn.id, sn.webPage));
  }

  async findById(id: string): Promise<SocialNetwork | null> {
    const sn = await this.prisma.socialNetwork.findFirst({
      where: { id: Number(id) },
    });

    if (!sn) return null;

    return new SocialNetwork(sn.id, sn.webPage);
  }

  async findByName(webpage: string | undefined): Promise<SocialNetwork | null> {
    if (!webpage) return null;

    const sn = await this.prisma.socialNetwork.findFirst({
      where: { webPage: webpage },
    });

    if (!sn) return null;

    return new SocialNetwork(sn.id, sn.webPage);
  }

  async update(id: string, sn: SocialNetwork): Promise<SocialNetwork> {
    const updated = await this.prisma.socialNetwork.update({
      where: { id: Number(id) },
      data: { webPage: sn.webPage },
    });

    return new SocialNetwork(updated.id, updated.webPage);
  }

  async delete(id: string): Promise<SocialNetwork> {
    const deleted = await this.prisma.socialNetwork.delete({
      where: { id: Number(id) },
    });

    return new SocialNetwork(deleted.id, deleted.webPage);
  }
}
