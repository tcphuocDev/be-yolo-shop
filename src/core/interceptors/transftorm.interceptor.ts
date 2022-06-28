import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponsePayload } from 'src/utils/response-payload';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponsePayload<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponsePayload<T>> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: data?.statusCode,
        message: data?.message,
        data: data?.data,
      })),
    );
  }
}
