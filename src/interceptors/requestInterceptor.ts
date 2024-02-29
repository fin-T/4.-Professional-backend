import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";

@Injectable()
export class RequestInterceptor implements NestInterceptor {
    async intercept(
        context: ExecutionContext,
        next: CallHandler<any>
    ): Promise<Observable<any>> {
        console.log(
            'Request caught by th interceptor',
            context.switchToHttp().getRequest().originalUrl,
        )

        return next.handle().pipe(map((data) => {
            return data === null ? { 'data': '' } : { 'data': data };
        }))
    }

}