import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { SetMetadata } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ISignedUser } from 'src/shared/ISignedUset';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private logger: Logger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const requiredRole = this.reflector.getAllAndOverride('role', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync<ISignedUser>(token);
      request['user'] = payload;
      console.log(payload.roles);
      console.log(requiredRole);
      if (
        !payload.roles.includes(requiredRole) &&
        !payload.roles.includes('Admin')
      ) {
        throw new UnauthorizedException(
          "Your role doesn't have access to this feature",
        );
      }
    } catch (e) {
      this.logger.error('Could not log in due to: ', e);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

export const Roles = (role) => SetMetadata('role', role);
