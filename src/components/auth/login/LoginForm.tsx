"use client";

import { useOrganization } from "@/contexts/OrganizationContext";
import { AccesDeniedError } from "@/lib/common/http.errors";
import httpInternalApi from "@/lib/common/http.internal.service";
import LoginScheme from "@/schemes/login.scheme";
import { FormData } from "@/types/auth.d";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import InputField from "../../form/InputField";
import SubmitButton from "../../form/SubmitButton";

const LoginForm = () => {
  const { slug } = useOrganization();
  const methods = useForm<FormData>({
    resolver: yupResolver(LoginScheme),
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || undefined;

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
        if (!redirectPath) {
          window.location.href = `/${slug}/users`;
        } else {
          router.replace(redirectPath);
        }
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
        className="w-full flex flex-col items-center justify-center w-full gap-5 sm:gap-6 text-black dark:text-white"
      >
        <div className="w-[65%] flex items-center justify-center bg-transparent">
          <InputField
            type="email"
            fieldName="email"
            label="Email"
            placeholder={`jhondoe@${slug}.com`}
          />
        </div>

        <div className="w-[65%] flex items-center justify-center">
          <InputField
            type="password"
            fieldName="password"
            label="Password"
            placeholder="********"
          />
        </div>

        <div className="w-[65%] flex items-center justify-center">
          <SubmitButton
            label="Iniciar sesión"
            onSubmit={onSubmit}
            styles="text-center md:w-[57%] sm:w-full bg-white text-black hover:bg-white hover:text-electric-blue transition-all font-semibold py-2 px-4 rounded-md mt-2"
          />
        </div>

        <div className="text-sm text-center text-gray-400 w-full">
          <Link
            href="/forgot-password"
            className="hover:underline text-electric-blue block w-full text-center"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* <div className="text-sm text-center text-gray-400 w-full">
      ¿Aún no tienes cuenta?{" "}
      <a
        href={`/${slug}/auth/register`}
        className="hover:underline text-electric-blue"
      >
        Regístrate
      </a>
    </div> */}
      </form>
    </FormProvider>
  );
};

export default LoginForm;
