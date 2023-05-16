import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IdToken = createParamDecorator(
    (_: unknown,ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.cookies?.['id_token']
  },
);