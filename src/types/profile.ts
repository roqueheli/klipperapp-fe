export interface Profile {
    id: number;
    name: string;
    email: string;
    birth_date: string;
    phone_number: string;
    organization_id: number;
    branch_id: number | null;
    status?: string;
};

export interface ProfileResponse {
    error?: string;
    status?: number;
    profile?: Profile;
    is_attended_today?: boolean;
}

export interface ProfileByNumber {
    profile?: Profile;
    is_attended_today?: boolean;
}

export interface ProfileByNumberResponse {
    profile?: ProfileByNumber;
}