import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const CTX = host.switchToHttp();
    const RESPONSE = CTX.getResponse();
    const REQUEST = CTX.getRequest();

    const STATUS =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const MSG =
      exception instanceof HttpException ? exception.getResponse : exception;

    this.logger.error(`Status:${STATUS} Error: ${JSON.stringify(MSG)}`);

    RESPONSE.status(STATUS).json({
      timestaps: new Date().toISOString(),
      path: REQUEST.url,
      error: MSG,
    });
  }
}
