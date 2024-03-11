import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ISignedUser } from 'src/shared/ISignedUset';

export class BaseAuthenticatedService {
  @Inject(REQUEST)
  private readonly request: Request;

  get user() {
    return (this.request as any).user as ISignedUser;
  }
}
