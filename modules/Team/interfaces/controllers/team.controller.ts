import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTeamDto } from '../../application/dtos/create-team.dto';
import { UpdateTeamDto } from '../../application/dtos/update-team.dto';
import { GetTeamUseCase } from '../../application/use-case/get-team.use-case';
import { CreateTeamUseCase } from '../../application/use-case/create-team.use-case';
import { UpdateTeamUseCase } from '../../application/use-case/update-team.use-case';
import { SoftDeleteTeamUseCase } from '../../application/use-case/soft-deleted-team.use-case';

@Controller('teams')
export class TeamController {
  constructor(
    private readonly get: GetTeamUseCase,
    private readonly crear: CreateTeamUseCase,
    private readonly actualizar: UpdateTeamUseCase,
    private readonly deleted: SoftDeleteTeamUseCase,
  ) {}

  @Get()
  async getAll() {
    return this.get.getallTeam();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.get.getTeamById(Number(id));
  }

  @Post()
  async create(@Body() data: CreateTeamDto) {
    return this.crear.createTeam(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateTeamDto) {
    return this.actualizar.updateTeam(Number(id), data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.deleted.deleteTeam(Number(id));
  }
}
