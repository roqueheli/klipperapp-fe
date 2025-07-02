import * as yup from "yup";

const RestoreScheme = yup
    .object({
        email: yup.string().required().email('Invalid email'),
        code: yup.string().required(),
        password: yup.string().required().min(6, 'Password must be at least 6 characters'),
        password_confirmation: yup
            .string()
            .required()
            .oneOf([yup.ref('password')], 'Passwords must match')
            .min(6, 'Password must be at least 6 characters'),
    })
    .required();

export default RestoreScheme;