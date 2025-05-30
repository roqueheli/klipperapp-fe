import * as Yup from "yup";

const RegisterScheme = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
    confirm_password: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').optional(),
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    phone: Yup.string().required('Phone Number is required'),
    birth_date: Yup.date().required('Birthdate is required'),
});

export default RegisterScheme;