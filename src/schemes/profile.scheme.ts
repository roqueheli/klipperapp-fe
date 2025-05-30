import * as yup from "yup";

const ProfileScheme = yup
    .object({
        professional_summary: yup.string().optional(),
        cv_url: yup.string().optional(),
        linkedin_url: yup.string().optional(),
        github_url: yup.string().optional(),
        portfolio_url: yup.string().optional(),
    })
    .required();

export default ProfileScheme;