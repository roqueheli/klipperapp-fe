import * as yup from "yup";

const LoginScheme = yup
    .object({
        email: yup.string().required('Email is required'),
        password: yup.string().required().min(8, 'Password must be at least 8 characters'),
    })
    .required();

export default LoginScheme;