import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

export const winstonLoggerConfig: WinstonModuleOptions = {
  transports: [
    // 콘솔 로그
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike('NestApp', { prettyPrint: true }),
      ),
    }),
    // 파일 로그 (info 수준)
    new winston.transports.File({
      filename: 'logs/app-info.log',
      level: 'info',
    }),
    // 파일 로그 (error 수준)
    new winston.transports.File({
      filename: 'logs/app-error.log',
      level: 'error',
    }),
  ],
};