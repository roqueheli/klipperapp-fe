export type LoginResponseType = {
    token: string;
}

export type RegisterResponseType = {
    data: LoginResponseType;
}

export type RegisterData = {
    email: string;
    password: string | undefined;
    confirm_password: string | undefined;
    name: string;
    phone_number: string;
    birth_date: Date;
};

export type FormData = {
    email: string;
    password: string;
};