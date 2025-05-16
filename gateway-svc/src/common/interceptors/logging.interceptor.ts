import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    const { method, originalUrl: url, user } = req;
    const email = user?.email || 'anonymous';
    const roles = user?.roles?.join(', ') || 'N/A';

    this.logger.log(`[HTTP] ${method} ${url} requested by user=${email}, roles=[${roles}]`, 'INFO');

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        this.logger.log(`[HTTP] ${method} ${url} completed in ${duration}ms`, 'INFO');
      }),
    );
  }
}