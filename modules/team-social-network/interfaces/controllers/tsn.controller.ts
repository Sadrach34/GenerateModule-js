import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GetTeamSocialNeworkUseCase } from '../../application/use-case/get-tsn.use-case';
import { SoftDeleteTeamSocialNetworkUseCase } from '../../application/use-case/soft-deleted-tsn.use-case';
import { CreateTeamSocialNetworkUseCase } from '../../application/use-case/create-tsn.use-case';
import { UpdateTeamSocialNetworkUseCase } from '../../application/use-case/update-tsn.use-case';
import { CreateTeamSocialNetworkDto } from '../../application/dtos/create-tsn.dto';
import { UpdateTeamSocialNetworkDto } from '../../application/dtos/update-tsn.dto';

@Controller('team-social-network')
export class teamSocialNetworkController {
  constructor(
    private readonly get: GetTeamSocialNeworkUseCase,
    private readonly deleted: SoftDeleteTeamSocialNetworkUseCase,
    private readonly created: CreateTeamSocialNetworkUseCase,
    private readonly updated: UpdateTeamSocialNetworkUseCase,
  ) {}

  @Get()
  async getAll() {
    return this.get.getallTSN();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.get.getTSNById(Number(id));
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.deleted.deleteTSN(Number(id));
  }

  @Post()
  async create(@Body() data: CreateTeamSocialNetworkDto) {
    return await this.created.createTeam(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateTeamSocialNetworkDto,
  ) {
    return this.updated.updateTeam(Number(id), data);
  }
}
