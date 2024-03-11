import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/PrismaService';
import {
  ILoanApplicationCreate,
  ILoanApplicationRepository,
  ILoanApplicationWithId,
} from './interfaces/ILoanApplicationRepository';
import { LoanApplication, User } from '@prisma/client';

type LoanWithUser = {
  user: User;
} & LoanApplication;

@Injectable()
export class LoanApplicationRepository implements ILoanApplicationRepository {
  constructor(
    private prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  async getById(id: number): Promise<ILoanApplicationWithId> {
    const loan = await this.prisma.loanApplication.findFirstOrThrow({
      where: { id },
      include: { user: true },
    });
    return this.toDto(loan);
  }

  async create(
    loanApplication: ILoanApplicationCreate,
  ): Promise<ILoanApplicationWithId> {
    const loan = await this.prisma.loanApplication.create({
      data: loanApplication,
      include: { user: true },
    });
    return this.toDto(loan);
  }

  async getAll(): Promise<ILoanApplicationWithId[]> {
    const loans = await this.prisma.loanApplication.findMany({
      include: { user: true },
    });
    return loans.map(this.toDto);
  }

  private toDto(loan: LoanWithUser): ILoanApplicationWithId {
    const {
      user: { email, username },
      description,
      createdAt,
      amount,
      id,
      status,
    } = loan;
    return {
      userEmail: email,
      username,
      amount: amount.toNumber(),
      status: status.toString(),
      description,
      createdAt,
      id,
    };
  }
}
