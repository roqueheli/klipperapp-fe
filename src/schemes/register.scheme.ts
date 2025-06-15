import * as Yup from "yup";

const RegisterScheme = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').notRequired(),
    confirm_password: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').notRequired(),
    name: Yup.string().required('Name is required'),
    phone_number: Yup.string().required('Phone Number is required'),
    birth_date: Yup.date().required('Birthdate is required'),
}).strict();

export default RegisterScheme;