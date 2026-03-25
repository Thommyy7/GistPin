import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const { method, url, ip } = req;

    // Skip health checks to avoid log noise
    if (url.startsWith('/health')) {
      return next.handle();
    }

    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const ms = Date.now() - start;
          const status = res.statusCode;
          const log = `${method} ${url} ${status} ${ms}ms — ${ip}`;

          if (status >= 500) this.logger.error(log);
          else if (status >= 400) this.logger.warn(log);
          else this.logger.log(log);
        },
        error: (err: Error) => {
          const ms = Date.now() - start;
          this.logger.error(`${method} ${url} ERROR ${ms}ms — ${err.message}`);
        },
      }),
    );
  }
}
