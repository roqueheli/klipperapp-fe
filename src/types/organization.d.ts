export interface Organization {
    id: string
    name: string
    description?: string
    favicon? : string
    metadata?: {
        primaryColor: string
        secondaryColor?: string
        accentColor?: string
        favicon?: string
        logo?: string
        fonts?: {
            primary?: string
            secondary?: string
        }
    }
}