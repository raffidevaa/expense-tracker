export class CreateExpenseDto {
  type: string;
  amount: number;
  description: string;
  account_id: string;
  category_id: string;
}

export class UpdateExpenseDto {
  type?: string;
  amount?: number;
  description?: string;
  account_id?: string;
  category_id?: string;
}

export class Statistics {
  balance: number;
  spending: number;
  cashflow: number;
  income: number;
}
