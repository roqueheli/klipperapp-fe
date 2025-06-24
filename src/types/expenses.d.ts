export interface Expenses {
    id: number;
    description: string;
    amount: number;
    organization_id: number;
    user_id: number;
    branch_id: number;
    quantity: number;
    created_at: string;
}

export interface ExpenseResponse {
    expenses: Expenses,
    status: number
}

export interface ExpensesResponse {
    expenses: Expenses[],
    status: number
}