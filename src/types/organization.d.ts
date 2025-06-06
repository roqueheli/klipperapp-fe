export interface Organization {
    id: number; // cambiado de string a number según la respuesta
    name: string;
    slug: string;
    metadata: {
        menus?: Array
        primaryColor?: string;
        secondaryColor?: string;
        accentColor?: string;
        favicon?: string;
        logo?: string;
        fonts?: {
            primary?: string;
            secondary?: string;
        };
    } | null;
    bio?: string | null;
    created_at: string;
    updated_at: string;
}

export interface OrganizationResponse {
    organization: Organization;
}

