import RegisterForm from '@/components/auth/register/RegisterForm';

type Props = {}

const RegisterPage = (props: Props) => {
  return (
    <div className='flex items-center w-full flex-col'>
      <h1 className="font-heading text-3xl font-bold text-electric-blue">🤖 Welcome human</h1>
      <RegisterForm />
    </div>
  )
}

export default RegisterPage;