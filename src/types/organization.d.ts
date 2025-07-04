export interface Organization {
    id: number; // cambiado de string a number según la respuesta
    name: string;
    slug: string;
    metadata: {
        billing_configs?: {
            extra_discount?: number;
            organization_percentage?: number;
            user_percentage?: number;
        }
        media_configs?: {
            logo_url?: string;
            favicon?: string;
		}
        menus: [] | undefined;
        payment_config: {
            week_start: number;
            week_end: number;
        }
    } | null;
    bio?: string | null;
    photo_url?: string | null;
}

export interface OrganizationResponse {
    organization: Organization;
}

export interface UpateOrganization {
    profile: Organization;
}

