"use client";

import { useOrganization } from "@/contexts/OrganizationContext";
import { AccesDeniedError } from "@/lib/common/http.errors";
import httpInternalApi from "@/lib/common/http.internal.service";
import LoginScheme from "@/schemes/login.scheme";
import { FormData } from "@/types/auth.d";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import InputField from "../../form/InputField";
import SubmitButton from "../../form/SubmitButton";

const LoginForm = () => {
  const { slug } = useOrganization();
  const router = useRouter();
  const methods = useForm<FormData>({
    resolver: yupResolver(LoginScheme),
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: FormData) => {
    const { email, password } = data;

    await toast
      .promise(
        httpInternalApi.httpPostPublic("/auth/login", "POST", {
          email,
          password,
        }),
        {
          loading: "Logging in...",
          success: "Login successful!",
          error: "Failed to log in. Please check your credentials.",
        }
      )
      .then(() => {
        router.push(`/${slug}/user`);
      })
      .catch((error) => {
        if (error instanceof AccesDeniedError) {
          toast.error("Access Denied");
        } else {
          toast.error("Internal server error");
        }
      });

    return false;
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center flex-col w-full p-4"
      >
        <InputField
          type="email"
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

        <SubmitButton
          label="Login"
          onSubmit={onSubmit}
          styles="btn-secondary mt-4 w-[50%] text-center rounded-md"
        />

        <div className="mt-4 text-sm text-gray-600">
          <a href="/forgot-password" className="text-blue-500 hover:underline">
            ¿Forgot your password?
          </a>
        </div>

        <div className="mt-2 text-sm text-gray-600">
          ¿Aún no tienes cuenta?{" "}
          <a
            href={`/${slug}/auth/register`}
            className="text-blue-500 hover:underline"
          >
            Register
          </a>
        </div>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
