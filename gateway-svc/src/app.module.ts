import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerConfig } from './logger/logger.config';
import { ResponseFormatInterceptor } from './common/interceptors/response-format.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ProxyModule } from './proxy/proxy.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true, }),

    WinstonModule.forRoot(winstonLoggerConfig),

    HttpModule,
    ProxyModule,

    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [JwtStrategy, ResponseFormatInterceptor, HttpExceptionFilter,],
})
export class AppModule {}