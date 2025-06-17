import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateServiceDto } from '../../application/dtos/create-service.dto';
import { UpdateServiceDto } from '../../application/dtos/update-service.dto';
import { GetServicesUseCase } from '../../application/use-case/get-service.use-case';
import { CreateServiceUseCase } from '../../application/use-case/create-service.use-case';
import { UpdateServiceUseCase } from '../../application/use-case/update-service.use-case';
import { SoftDeletedServiceUseCase } from '../../application/use-case/soft-deleted-service.use-case';

@Controller('services')
export class ServiceController {
  constructor(
    private readonly get: GetServicesUseCase,
    private readonly created: CreateServiceUseCase,
    private readonly updated: UpdateServiceUseCase,
    private readonly deleted: SoftDeletedServiceUseCase,
  ) {}

  @Get()
  async getAll() {
    return this.get.getallService();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.get.getByIdService(Number(id));
  }

  @Post()
  async create(@Body() data: CreateServiceDto) {
    return await this.created.createService(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateServiceDto) {
    return this.updated.updateService(Number(id), data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.deleted.deleteService(Number(id));
  }
}
