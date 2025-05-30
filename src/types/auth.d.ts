export type LoginResponseType = {
    access_token: string;
}

export type RegisterResponseType = {
    data: LoginResponseType;
}

export type RegisterData = {
    email: string;
    password: string;
    confirm_password?: string;
    first_name: string;
    last_name: string;
    phone: string;
    birth_date: Date;
};

export type FormData = {
    email: string;
    password: string;
};