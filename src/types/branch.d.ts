export interface Branch {
    id: number;
    name: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    phone_number: string;
    email: string;
    organization_id: number;
    active: boolean;
    photo_url: string;
}

export interface BranchResponse {
    status: number;
    branches: Branch[];
}