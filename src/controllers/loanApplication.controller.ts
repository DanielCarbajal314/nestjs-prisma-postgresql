import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthGuard, Roles } from 'src/filters/AuthGuard';
import { CreateLoanApplicationDto } from 'src/models/CreateLoanApplications';
import { CreateLoanApplicationsResponseDto } from 'src/models/LoanApplicationsResponse.dto';
import { LoanApplicationService } from 'src/services/loanApplication.service';

@Controller('applications')
export class LoanApplicationController {
  constructor(
    private readonly loanApplicationService: LoanApplicationService,
  ) {}

  @Get()
  @Roles('Admin')
  @UseGuards(AuthGuard)
  @ApiResponse({ type: CreateLoanApplicationsResponseDto })
  async getAll(): Promise<CreateLoanApplicationsResponseDto[]> {
    return await this.loanApplicationService.getAll();
  }

  @Get(':id')
  @Roles('Applicant')
  @UseGuards(AuthGuard)
  @ApiResponse({ type: CreateLoanApplicationsResponseDto })
  async get(
    @Param('id') id: string,
  ): Promise<CreateLoanApplicationsResponseDto> {
    return await this.loanApplicationService.getById(parseInt(id));
  }

  @Post()
  @Roles('Applicant')
  @UseGuards(AuthGuard)
  @ApiResponse({ type: CreateLoanApplicationsResponseDto })
  async create(
    @Body() data: CreateLoanApplicationDto,
  ): Promise<CreateLoanApplicationsResponseDto> {
    return await this.loanApplicationService.create(data);
  }
}
