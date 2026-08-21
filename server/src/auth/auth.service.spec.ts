import { Test } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let authService: AuthService;
  let prisma: { user: { findUnique: jest.Mock; create: jest.Mock } };

  const existingUser = {
    id: 'user-1',
    name: 'Pat',
    email: 'pat@example.com',
    password: '',
  };

  beforeEach(async () => {
    existingUser.password = await bcrypt.hash('correct-password', 10);

    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: { sign: jest.fn().mockReturnValue('signed-jwt') } },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
  });

  describe('register', () => {
    it('rejects an email that is already taken', async () => {
      prisma.user.findUnique.mockResolvedValue(existingUser);

      await expect(
        authService.register({ name: 'New', email: existingUser.email, password: 'whatever123' }),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('hashes the password before persisting and returns a token', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockImplementation((args: { data: { name: string; email: string; password: string } }) =>
        Promise.resolve({ id: 'new-id', ...args.data }),
      );

      const result = await authService.register({
        name: 'New User',
        email: 'new@example.com',
        password: 'plainTextPassword',
      });

      const persistedPassword = prisma.user.create.mock.calls[0][0].data.password;
      expect(persistedPassword).not.toBe('plainTextPassword');
      expect(await bcrypt.compare('plainTextPassword', persistedPassword)).toBe(true);
      expect(result.accessToken).toBe('signed-jwt');
      expect(result.user).not.toHaveProperty('password');
    });
  });

  describe('login', () => {
    it('throws on unknown email without revealing that the account does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'ghost@example.com', password: 'anything123' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('throws on a wrong password', async () => {
      prisma.user.findUnique.mockResolvedValue(existingUser);

      await expect(
        authService.login({ email: existingUser.email, password: 'wrong-password' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('returns a token on correct credentials', async () => {
      prisma.user.findUnique.mockResolvedValue(existingUser);

      const result = await authService.login({
        email: existingUser.email,
        password: 'correct-password',
      });

      expect(result.accessToken).toBe('signed-jwt');
      expect(result.user.email).toBe(existingUser.email);
    });
  });
});
