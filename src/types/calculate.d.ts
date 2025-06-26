import { Attendance } from "./attendance";
import { Expenses } from "./expenses";
import { User } from "./user";

export interface CalculatePayment {
    organization_id: number;
    branch_id?: number;
    user_id?: number;
    start_date?: string;
    end_date?: string;
}

export interface CalculatePaymentResponse {
    user: User,
    finished_attendances: Attendance[];
    other_attendances: Attendance[];
    expenses?: Expenses[];
    earnings?: number;
    total_expenses?: number;
    amount_to_pay?: number;
}