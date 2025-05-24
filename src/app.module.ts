import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [UserController],
  providers: [PrismaService, UserService],
})
export class AppModule {}
