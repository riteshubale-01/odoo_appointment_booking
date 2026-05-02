import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(user_id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { user_id },
    });
  }

  async markAsVerified(user_id: string): Promise<User> {
    return this.prisma.user.update({
      where: { user_id },
      data: { is_verified: true },
    });
  }

  async updatePassword(user_id: string, passwordHash: string): Promise<User> {
    return this.prisma.user.update({
      where: { user_id },
      data: { password: passwordHash },
    });
  }
}
