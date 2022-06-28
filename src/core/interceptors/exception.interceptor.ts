import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ExceptionEnterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((err) => {
        // To do implement exception rule
        throw err;
        // throw new HttpException(
        //   'Exception interceptor message',
        //   HttpStatus.BAD_GATEWAY,
        // );
      }),
    );
  }
}
