-- CreateEnum
CREATE TYPE "LoanApplicationStatus" AS ENUM ('SUMMITED', 'REVIEWING', 'ACCEPTED', 'DECLINED', 'OBSERVED');

-- AlterTable
ALTER TABLE "LoanApplication" ADD COLUMN     "status" "LoanApplicationStatus" NOT NULL DEFAULT 'SUMMITED';
