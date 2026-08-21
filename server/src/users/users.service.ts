import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Small helper service - auth handles registration/login directly against
// Prisma, this is for the odd case another module needs a user lookup
// (mail service pulling a name/email, for instance) without duplicating
// the query everywhere.
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password: _password, ...safeUser } = user;
    return safeUser;
  }
}
