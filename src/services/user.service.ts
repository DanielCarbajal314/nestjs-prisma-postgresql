import { UnauthorizedException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/models/CreateUser.dto';
import { UserRepository } from 'src/persistancy';
import { createHash } from 'crypto';
import { LoginDto } from 'src/models/Login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ISignedUser } from 'src/shared/ISignedUset';
import { UserLoginResponseDto } from 'src/models/UserLoginResponse.dto';

@Injectable()
export class UserService {
  private salt: string;

  constructor(
    private userRepository: UserRepository,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    this.salt = this.configService.get<string>('KEY_SECRET');
  }

  private hash(word: string): string {
    return createHash('sha256')
      .update(word)
      .update(createHash('sha256').update(this.salt, 'utf8').digest('hex'))
      .digest('hex');
  }

  async createUser(user: CreateUserDto) {
    const { password, ...others } = user;
    await this.userRepository.createUser({
      ...others,
      password: this.hash(password),
    });
  }

  async login({ username, password }: LoginDto): Promise<UserLoginResponseDto> {
    const user = await this.userRepository.getByUsername(username);
    const passwordHash = this.hash(password);
    const passwordDoNotMatch = passwordHash !== user.password;
    if (passwordDoNotMatch) {
      throw new UnauthorizedException('Credentials are incorrect');
    }
    const { email, roles, id } = user;
    const signedUser: ISignedUser = {
      username,
      id,
      email,
      roles,
    };
    return {
      access_token: await this.jwtService.signAsync(signedUser),
    };
  }
}
