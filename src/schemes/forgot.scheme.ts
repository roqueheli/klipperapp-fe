import * as yup from "yup";

const ForgotScheme = yup
    .object({
        email: yup.string().required('Email is required'),
    })
    .required();

export default ForgotScheme;