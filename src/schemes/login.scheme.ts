import * as yup from "yup";

const LoginScheme = yup
    .object({
        email: yup.string().required('Email is required'),
        password: yup.string().required().min(6, 'Password must be at least 6 characters'),
    })
    .required();

export default LoginScheme;