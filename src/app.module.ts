import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './persistancy/repositories/UserRepository';
import { PrismaService } from './persistancy/prisma/PrismaService';
import { APP_FILTER } from '@nestjs/core';
import { PrismaClientKnownRequestErrorFilter } from './filters/PrimaErrorHandling';
import { JwtModule } from '@nestjs/jwt';
import { JWTSecret } from './config';
import { WinstonModule, utilities } from 'nest-winston';
import { transports, format } from 'winston';
import { LoanApplicationController } from './controllers/loanApplication.controller';
import {
  ILoanApplicationRepository,
  IUserRepository,
  LoanApplicationRepository,
} from './persistancy';
import { LoanApplicationService } from './services/loanApplication.service';

const messageFormat = utilities.format.nestLike('App', {
  colors: true,
  prettyPrint: true,
});

@Module({
  imports: [
    ConfigModule.forRoot(),
    WinstonModule.forRoot({
      level: 'debug',
      transports: new transports.Console({
        format: format.combine(format.timestamp(), format.ms(), messageFormat),
      }),
    }),
    JwtModule.register({
      global: true,
      secret: JWTSecret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [AppController, UserController, LoanApplicationController],
  providers: [
    AppService,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    {
      provide: ILoanApplicationRepository,
      useClass: LoanApplicationRepository,
    },
    UserService,
    PrismaService,
    LoanApplicationService,
    {
      provide: APP_FILTER,
      useClass: PrismaClientKnownRequestErrorFilter,
    },
    Logger,
  ],
})
export class AppModule {}
