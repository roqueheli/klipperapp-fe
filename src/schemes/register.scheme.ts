import * as Yup from "yup";

const RegisterScheme = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').optional(),
    name: Yup.string().required('Name is required'),
    phone_number: Yup.string().required('Phone Number is required'),
    birth_date: Yup.date().required('Birthdate is required'),
});

export type RegisterData = Yup.InferType<typeof RegisterScheme>;

export default RegisterScheme;