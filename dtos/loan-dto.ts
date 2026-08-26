export default interface LoanDTO {
  id?: string;
  userId: string;
  benUserId: string;
  amount: number;
  interest: number;
  term: number;
  startDate?: string | null;
  loanStatusId: string;
  settlementDate?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}
