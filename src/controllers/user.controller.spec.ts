import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../persistancy';
import { ISignedUser } from '../shared/ISignedUset';
import { Logger, UnauthorizedException } from '@nestjs/common';

const JWT_SECRET = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
const HASHING_SALT = '80zzm081sr@nd0m';
const CORRECT_PASSWORD = 'test1234';
const CORRECT_PASSWORD_HASHED =
  '13352457c572aafb97d2876778e87df8b764415bfd93bac9b161fa816040d888';

describe('AppController', () => {
  let userController: UserController;
  let jwtService: JwtService;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: JWT_SECRET,
          signOptions: { expiresIn: '3600s' },
        }),
      ],
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => HASHING_SALT),
          },
        },
        {
          provide: IUserRepository,
          useValue: {
            getByUsername: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: console,
        },
      ],
    }).compile();
    jwtService = app.get<JwtService>(JwtService);
    userController = app.get<UserController>(UserController);
    userRepository = app.get<IUserRepository>(IUserRepository);
  });

  describe('User Controller', () => {
    it('Login with correct credentials', async () => {
      jest.spyOn(userRepository, 'getByUsername').mockReturnValue(
        Promise.resolve({
          id: 1,
          username: 'daniel',
          password: CORRECT_PASSWORD_HASHED,
          email: 'daniel.carbajal@pucp.edu.pe',
          roles: ['Admin', 'Applicant'],
        }),
      );
      const { access_token: token } = await userController.login({
        username: 'daniel',
        password: CORRECT_PASSWORD,
      });
      const { username, id, email, roles } =
        await jwtService.verifyAsync<ISignedUser>(token);
      expect(username).toBe('daniel');
      expect(id).toBe(1);
      expect(email).toBe('daniel.carbajal@pucp.edu.pe');
      expect(roles[0]).toBe('Admin');
      expect(roles[1]).toBe('Applicant');
    });

    it('Login with wrong credentials', async () => {
      jest.spyOn(userRepository, 'getByUsername').mockReturnValue(
        Promise.resolve({
          id: 1,
          username: 'daniel',
          password: CORRECT_PASSWORD_HASHED,
          email: 'daniel.carbajal@pucp.edu.pe',
          roles: ['Admin', 'Applicant'],
        }),
      );
      expect(
        async () =>
          await userController.login({
            username: 'daniel',
            password: 'NOT_A_PASSWROD',
          }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Register user hashing its password', async () => {
      await userController.createUser({
        username: 'daniel',
        password: CORRECT_PASSWORD,
        email: 'daniel.carbajal@pucp.edu.pe',
        roles: ['Applicant'],
      });
      expect(userRepository.createUser).toHaveBeenCalled();
      expect(userRepository.createUser).toHaveBeenCalledWith({
        username: 'daniel',
        password: CORRECT_PASSWORD_HASHED,
        email: 'daniel.carbajal@pucp.edu.pe',
        roles: ['Applicant'],
      });
    });
  });
});
