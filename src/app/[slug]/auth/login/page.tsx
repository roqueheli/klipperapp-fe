import LoginForm from "@/components/auth/login/LoginForm";

type Props = {}

const LoginPage = (props: Props) => {
    return (
        <div className='flex items-center w-full flex-col'>
            <h1 className="font-heading text-3xl font-bold text-electric-blue">👋🏼 Welcome again</h1>
            <LoginForm />
        </div>
    )
}

export default LoginPage;
