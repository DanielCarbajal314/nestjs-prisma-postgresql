export type ILoanApplication = {
  amount: number;
  username: string;
  userEmail: string;
  createdAt: Date;
  description: string;
};

export type ILoanApplicationCreate = {
  amount: number;
  userId: number;
  description: string;
};

export type ILoanApplicationWithId = {
  id: number;
  status: string;
} & ILoanApplication;

export interface ILoanApplicationRepository {
  getById(id: number): Promise<ILoanApplicationWithId | null>;
  create(
    loanApplication: ILoanApplicationCreate,
  ): Promise<ILoanApplicationWithId>;
  getAll(): Promise<ILoanApplicationWithId[]>;
}

export const ILoanApplicationRepository = Symbol('ILoanApplicationRepository');
