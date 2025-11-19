import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const header = request.headers?.authorization;
    if (!header) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err: unknown, user: any, info: unknown) {
    if (err || info) {
      return null;
    }
    return user ?? null;
  }
}
