export interface Role {
    id: number;
    name?: string;
    description?: string | null;
}

export interface RoleResponse {
    roles: Role[];
    status: number;
}