import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerConfig } from './logger/logger.config';
import { Logger } from 'winston';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ResponseFormatInterceptor } from './common/interceptors/response-format.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonLoggerConfig),
  });
  const logger = app.get<Logger>(WINSTON_MODULE_NEST_PROVIDER);

  const loggingInterceptor = new LoggingInterceptor(logger);
  const responseFormatInterceptor = app.get(ResponseFormatInterceptor);

  app.useGlobalInterceptors(loggingInterceptor, responseFormatInterceptor);
  app.useGlobalFilters(new HttpExceptionFilter());
  
  const config = app.get(ConfigService);
  await app.listen(config.get('GATEWAY_PORT') || 3300);
}
bootstrap();