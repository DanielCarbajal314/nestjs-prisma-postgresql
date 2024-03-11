import { ApiProperty } from '@nestjs/swagger';

export class CreateLoanApplicationsResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  userEmail: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status: string;
}
