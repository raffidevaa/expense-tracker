export class CreateExpenseDto {
  amount: number;
  description: string;
  account_id: string;
  category_id: string;
}

export class UpdateExpenseDto {
  amount?: number;
  description?: string;
  account_id?: string;
  category_id?: string;
}
