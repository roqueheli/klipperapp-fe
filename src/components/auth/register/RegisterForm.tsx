"use client";
import InputField from "@/components/form/InputField";
import SubmitButton from "@/components/form/SubmitButton";
import { useOrganization } from "@/contexts/OrganizationContext";
import { AccesDeniedError } from "@/lib/common/http.errors";
import httpInternalApi from "@/lib/common/http.internal.service";
import RegisterScheme from "@/schemes/register.scheme";
import { RegisterData } from "@/types/auth.d";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const RegisterForm = () => {
  const { slug } = useOrganization();
  const router = useRouter();
  const methods = useForm<RegisterData>({
    resolver: yupResolver(RegisterScheme),
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: RegisterData) => {
    const { email, password, first_name, last_name, phone, birth_date } = data;

    await toast
      .promise(
        httpInternalApi.httpPostPublic("/auth/register", "POST", {
          email,
          password,
          first_name,
          last_name,
          phone,
          birth_date,
        }),
        {
          loading: "Register in...",
          success: "Register successful!",
          error: "Failed to register.",
        }
      )
      .then(() => {
        router.push("/profile");
      })
      .catch((error) => {
        if (error instanceof AccesDeniedError) {
          toast.error("Access Denied");
        } else {
          toast.error("Internal server error");
        }
      });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center flex-col w-full p-4"
      >
        <InputField
          type="text"
          fieldName="email"
          label="Email"
          placeholder="jhondoe@interviewai.com"
        />
        <InputField
          type="password"
          fieldName="password"
          label="Password"
          placeholder="********"
        />
        <InputField
          type="password"
          fieldName="confirm_password"
          label="Confirm Password"
          placeholder="********"
        />
        <InputField
          type="text"
          fieldName="first_name"
          label="First Name"
          placeholder="Jhon"
        />
        <InputField
          type="text"
          fieldName="last_name"
          label="Last Name"
          placeholder="Doe"
        />
        <InputField
          type="text"
          fieldName="phone"
          label="Phone Number"
          placeholder="+56 9 1234 1234"
        />
        <InputField
          type="date"
          fieldName="birth_date"
          label="Birthdate"
          placeholder="31'-12-2000"
        />
        <SubmitButton
          label="Register"
          onSubmit={onSubmit}
          styles="btn-secondary mt-4 w-[50%] text-center rounded-md"
        />

        <div className="mt-4 text-sm text-gray-600">
          ¿Already have an account?{" "}
          <a href={`/${slug}/auth/login`} className="text-blue-500 hover:underline">
            Login
          </a>
        </div>
      </form>
    </FormProvider>
  );
};

export default RegisterForm;
