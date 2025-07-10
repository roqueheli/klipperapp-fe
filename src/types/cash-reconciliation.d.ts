export interface BankBalance {
  account_name: string;
  balance: number;
}

export interface CashReconciliationPreviewResponse {
  opening_reconciliation_id: number | null; // Added, can be null if no opening
  last_opening_time: string | null;
  preview_time: string;
  initial_cash: string; // Changed to string
  initial_bank_total: number;
  expected_cash_from_sales: number;
  expected_pos_from_sales: number; // Added
  expected_transfer_from_sales: number; // Added
  expected_total_cash_on_hand: string; // Changed to string
  expected_total_pos_balance: number; // Added
  expected_total_transfer_balance: number; // Added
}

export interface CashReconciliationRequestPayload { // New interface for the nested payload
  reconciliation_type: "opening" | "closing";
  cash_amount: number;
  bank_balances: BankBalance[];
  notes?: string | null;
  reconciliation_date?: string; // Added
}

export interface CashReconciliationRequest { // New interface for the top-level request
  cash_reconciliation: CashReconciliationRequestPayload;
}

export interface CashReconciliationResponse {
  branch_id: number;
  id: number;
  reconciliation_type: "opening" | "closing";
  cash_amount: string;
  bank_balances: BankBalance[];
  total_calculated: string;
  expected_cash: string;
  expected_bank_transfer: string;
  expected_credit_card: string; // Present in response, not in request
  difference_cash: string;
  status: string;
  notes: string;
  user_id: number;
  organization_id: number;
  created_at: string;
  updated_at: string;
  difference_pos: string; // Added
  difference_transfer: string; // Added
  approved_at?: string; // Added, optional
  approved_by_user_id?: number; // Added, optional
}

export interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}