export interface Organization {
    id: number; // cambiado de string a number según la respuesta
    name: string;
    slug: string;
    metadata: {
        billing_configs?: {
            extra_discount?: number;
            organization_percentage?: number,
            user_percentage?: number
        }
        media_configs?: {
            logo_url?: string,
            favicon?: string
		}
        menus: [] | undefined
    } | null;
    bio?: string | null;
    created_at: string;
    updated_at: string;
}

export interface OrganizationResponse {
    organization: Organization;
}

