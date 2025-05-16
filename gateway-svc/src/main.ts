import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerConfig } from './logger/logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonLoggerConfig),
  });
  const config = app.get(ConfigService);
  await app.listen(config.get('PORT') || 3300);
}
bootstrap();