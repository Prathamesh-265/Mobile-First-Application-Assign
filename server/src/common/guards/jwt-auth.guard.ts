import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Thin wrapper around Passport's jwt strategy so routes can just do
// @UseGuards(JwtAuthGuard) instead of referencing the strategy name.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
