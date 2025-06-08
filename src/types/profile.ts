export interface Profile {
    id: number
    name: string;
    email?: string;
    phone_number: string;
    birth_date?: Date;
    organization_id: number;
};

export interface ProfileResponse {
    error?: string;
    status?: number;
    profile?: Profile;
}