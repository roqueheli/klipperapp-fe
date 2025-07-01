"use client";

import { useTheme } from "@/components/ThemeProvider";
import { useOrganization } from "@/contexts/OrganizationContext";
import { AccesDeniedError } from "@/lib/common/http.errors";
import httpInternalApi from "@/lib/common/http.internal.service";
import ForgotScheme from "@/schemes/forgot.scheme";
import { ForgotFormData } from "@/types/auth.d";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import InputField from "../../form/InputField";
import SubmitButton from "../../form/SubmitButton";

const ForgotForm = () => {
  const { theme } = useTheme();
  const { slug } = useOrganization();
  const methods = useForm<ForgotFormData>({
    resolver: yupResolver(ForgotScheme),
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: ForgotFormData) => {
    const { email } = data;

    await toast
      .promise(
        httpInternalApi.httpPostPublic("/auth/reset_password", "POST", {
          email,
        }),
        {
          loading: "Resetting password...",
          success: "Password reset successful!",
          error: "Failed to reset password.",
        }
      )
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
        className={`w-full flex flex-col items-center justify-center w-full gap-5 sm:gap-6 ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        <div className="w-[65%] flex items-center justify-center bg-transparent">
          <InputField
            type="email"
            fieldName="email"
            label="Email"
            placeholder={`jhondoe@${slug}.com`}
          />
        </div>

        <div className="w-[75%] flex items-center justify-center">
          <SubmitButton
            label="Restablecer contraseña"
            onSubmit={onSubmit}
            styles={`text-center md:w-[57%] sm:w-full ${
              theme === "dark"
                ? "text-gray-600 hover:bg-white shadow-xl"
                : "text-black hover:text-electric-blue"
            } bg-gray-300 transition-all font-semibold py-2 px-4 rounded-md mt-2`}
          />
        </div>
        <div className="text-sm text-center text-gray-400 w-full">
          <Link
            href={`/${slug}/auth/login`}
            className="hover:underline text-electric-blue block w-full text-center"
          >
            ¡Iniciar sesión!
          </Link>
        </div>
      </form>
    </FormProvider>
  );
};

export default ForgotForm;
