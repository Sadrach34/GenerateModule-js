import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateSocialNetworkDto } from '../../application/dtos/create-sn.dto';
import { UpdateSocialNetworkDto } from '../../application/dtos/update-sn.dto';
import { GetSocialNetworkUseCase } from '../../application/use-case/get-sn.use-case';
import { CreateSocialNetworkUseCase } from '../../application/use-case/create-sn.use-case';
import { UpdateSocialNetworkUseCase } from '../../application/use-case/update-sn.use-case';
import { SoftDeletedSocialNetworkUseCase } from '../../application/use-case/soft-deleted-sn.use-case';

@Controller('social-network')
export class SocialNetworkController {
  constructor(
    private readonly get: GetSocialNetworkUseCase,
    private readonly created: CreateSocialNetworkUseCase,
    private readonly updated: UpdateSocialNetworkUseCase,
    private readonly deleted: SoftDeletedSocialNetworkUseCase,
  ) {}

  @Get()
  async getAll() {
    return this.get.getallSocialnetwork();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.get.getSocialnetworkById(Number(id));
  }

  @Post()
  async create(@Body() data: CreateSocialNetworkDto) {
    return this.created.createSocialnetwork(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateSocialNetworkDto) {
    return this.updated.updateSocialnetwork(Number(id), data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.deleted.deleteSocialnetwork(Number(id));
  }
}
