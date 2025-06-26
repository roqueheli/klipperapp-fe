export interface Payment {
    id?: number;
    amount: number;
    organization_id: number;
    branch_id: number;
    user_id: number;
    aasm_state: string;
    starts_at: string;
    ends_at: string;
}
