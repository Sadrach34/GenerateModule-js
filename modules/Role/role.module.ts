import { Module } from '@nestjs/common';
import { RoleService } from './application/use-case/role.service';
import { RoleController } from './interfaces/controllers/role.controller';
import { PrismaService } from 'src/Connect/prisma.service';

@Module({
  controllers: [RoleController],
  providers: [RoleService, PrismaService],
  exports: [RoleService],
})
export class RoleModule {}
