import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Pulls the user Passport attached to req.user so controllers can do
// getTasks(@CurrentUser() user) instead of reaching into req manually.
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
