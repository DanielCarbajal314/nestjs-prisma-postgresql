import {
  IUserRepository,
  IUser,
  IUserWithId,
} from './interfaces/IUserRepository';
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/PrismaService';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  async getByUsername(username: string): Promise<IUserWithId | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { roles: true },
    });
    if (!user) {
      this.logger.warn(`User: ${username} - Do not exist`);
      throw new BadRequestException('Credentials are wrong');
    } else {
      const { email, password, roles, id } = user;
      return {
        email,
        password,
        id,
        username,
        roles: roles.map((x) => x.name),
      };
    }
  }

  async createUser(user: IUser): Promise<void> {
    const { email, password, roles, username } = user;
    const rolesFound = await this.prisma.roles.findMany({
      where: { name: { in: roles } },
    });
    const rolesDoNotMatch = rolesFound.length !== roles.length;
    if (rolesDoNotMatch) {
      throw new BadRequestException('Not All Roles where found');
    } else {
      await this.prisma.user.create({
        data: {
          email,
          password,
          username,
          roles: {
            connect: rolesFound,
          },
        },
      });
    }
  }
}
