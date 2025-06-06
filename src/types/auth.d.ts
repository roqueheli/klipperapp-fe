export type LoginResponseType = {
    token: string;
}

export type RegisterResponseType = {
    data: LoginResponseType;
}

export type RegisterData = {
    email: string;
    password?: string;
    confirm_password?: string;
    name: string;
    phone_number: string;
    birth_date: Date;
};

export type FormData = {
    email: string;
    password: string;
};