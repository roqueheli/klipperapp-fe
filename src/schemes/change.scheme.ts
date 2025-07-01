import * as yup from "yup";

const ChangeScheme = yup
    .object({
        id: yup.number().required(),
        current_password: yup.string().required().min(6, 'Password must be at least 6 characters'),
        new_password: yup.string().required().min(6, 'Password must be at least 6 characters'),
        new_password_confirmation: yup
            .string()
            .required()
            .oneOf([yup.ref('new_password')], 'Passwords must match')
            .min(6, 'Password must be at least 6 characters'),
    })
    .required();

export default ChangeScheme;
