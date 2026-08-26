import LoanDTO from "./loan-dto";

export default interface RepaymentDTO {
  id?: string;
  loanId: string;
  amount: number;
  loan?: LoanDTO;
  createdAt?: string | null;
}
