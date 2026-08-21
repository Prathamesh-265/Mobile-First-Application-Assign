// Split out from lib/api.ts so middleware.ts (Edge runtime) doesn't have
// to pull in axios just to read this one string constant.
export const AUTH_COOKIE = 'tm_token';
