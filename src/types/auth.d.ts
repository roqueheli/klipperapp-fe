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

export type ForgotFormData = {
    email: string;
};

export type RestoreFormData = {
    email: string;
    code: string;
    password: string;
    password_confirmation: string;
};

export type ChangeFormData = {
    id: number;
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
};
