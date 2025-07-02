
export interface CardInterface {
    data?: { name: string; count: number }[];
    barColor?: string;
    title?: string;
    value?: string | number;
    color?: string;
    cardBg?: string;
    titleColor?: string;
}

export interface Statistics {
    total_profiles: number;
    total_new_profiles: number;
    total_concurrent_profiles: number;
    most_services: string;
    total_attendances: number;
}

export interface StatisticsResponse {
    statistics: Statistics;
}

export interface SummaryItem {
    date: string;
    total_attendances: number;
    user_amount: number;
    extra_discount: number;
    organization_amount: number;
    discount: number;
    total_amount: number;
    payment_method: Record<string, number>;
}

export interface UseSummaryOptions {
    startDate: string; // formato: YYYYMMDD
    endDate: string;   // formato: YYYYMMDD
    status?: string;   // "finished", "pending", etc
}

export interface SummaryResponse {
    summary: SummaryItem[];
    status: number;
}

