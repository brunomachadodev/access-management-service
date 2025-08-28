import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { tap } from 'rxjs';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: { userId: string; username: string } }>();
    const { method, url, user, body } = request as {
      method: string;
      url: string;
      user?: { userId: string; username: string };
      body: unknown;
    };

    return next.handle().pipe(
      tap(() => {
        const auditLog = {
          timestamp: new Date().toISOString(),
          userId: user?.userId,
          username: user?.username,
          action: `${method} ${url}`,
          requestBody: body,
          responseStatus: context.switchToHttp().getResponse<Response>()
            .statusCode,
        };

        this.logger.log(`AUDIT: ${JSON.stringify(auditLog)}`);
      }),
    );
  }
}
