import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 't$Weep@Pim2882',
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') || '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [JwtModule],
})
export class AuthModule {}
