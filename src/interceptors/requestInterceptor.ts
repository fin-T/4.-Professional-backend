import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
console.log('RequestInterceptor');

/**
 * Class for converting route handler responses.
 */
@Injectable()
export class RequestInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        if (data) {
          if (Array.isArray(data)) return { data: { items: data } };

          const keys = Object.keys(data);
          const values = Object.values(data);

          const idIndex = keys.indexOf('id');

          if (idIndex !== -1) {
            keys.splice(0, 0, keys.splice(idIndex, 1)[0]);
            values.splice(0, 0, values.splice(idIndex, 1)[0]);
          }

          const reorderedData = keys.reduce((acc, key, index) => {
            acc[key] = values[index];
            return acc;
          }, {});

          return { data: reorderedData };
        }
      }),
    );
  }
}
