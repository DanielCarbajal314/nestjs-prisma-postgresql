import { NotFoundException, Injectable, Scope, Inject } from '@nestjs/common';
import { CreateLoanApplicationDto } from 'src/models/CreateLoanApplications';
import {
  ILoanApplicationWithId,
  ILoanApplicationRepository,
} from 'src/persistancy';
import { BaseAuthenticatedService } from './baseAuthenticated.service';

@Injectable({ scope: Scope.TRANSIENT })
export class LoanApplicationService extends BaseAuthenticatedService {
  @Inject(ILoanApplicationRepository)
  private readonly userRepository: ILoanApplicationRepository;

  async getById(id: number): Promise<ILoanApplicationWithId> {
    const loan = await this.userRepository.getById(id);
    const cannotSeeThisLoan =
      !this.user.roles.includes('Admin') && this.user.email !== loan.userEmail;
    if (cannotSeeThisLoan) {
      throw new NotFoundException('Loan Application does not exist');
    }
    return loan;
  }
  async create(
    loanApplication: CreateLoanApplicationDto,
  ): Promise<ILoanApplicationWithId> {
    return await this.userRepository.create({
      ...loanApplication,
      userId: this.user.id,
    });
  }
  async getAll(): Promise<ILoanApplicationWithId[]> {
    return await this.userRepository.getAll();
  }
}
