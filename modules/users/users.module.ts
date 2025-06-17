import { Module } from '@nestjs/common';
import { UserController } from './interfaces/controllers/users.controller';
import { UserService } from './application/use-case/users.service';
import { PrismaModule } from 'src/Connect/prisma.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PrismaModule],
})
export class UserModule {}
