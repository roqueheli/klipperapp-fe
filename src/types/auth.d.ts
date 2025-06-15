export type LoginResponseType = {
    token: string;
}

export type RegisterResponseType = {
    data: LoginResponseType;
}

export type RegisterData = {
    email: string;
    password?: string | null;
    confirm_password?: string | null;
    name: string;
    phone_number: string;
    birth_date: Date;
};

export type FormData = {
    email: string;
    password: string;
};