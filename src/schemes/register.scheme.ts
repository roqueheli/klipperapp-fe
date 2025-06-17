import * as Yup from "yup";

const RegisterScheme = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().when('$requirePassword', {
        is: true,
        then: (schema) => schema.required('Password is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    confirm_password: Yup.string().when('$requirePassword', {
        is: true,
        then: (schema) =>
            schema.oneOf([Yup.ref("password")], "Passwords must match").required(),
        otherwise: (schema) => schema.notRequired(),
    }),
    name: Yup.string().required('Name is required'),
    phone_number: Yup.string().required('Phone Number is required'),
    birth_date: Yup.date()
        .transform((value, originalValue) => {
            console.log("orig", originalValue);
            console.log("val", value);
            return typeof originalValue === "string" ? new Date(originalValue) : value;
        })
        .typeError("Birthdate must be a valid date")
        .required("Birthdate is required"),
});

export default RegisterScheme;
