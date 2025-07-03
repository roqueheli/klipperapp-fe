"use client";

import { useTheme } from "@/components/ThemeProvider";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import { AccesDeniedError } from "@/lib/common/http.errors";
import httpInternalApi from "@/lib/common/http.internal.service";
import RestoreScheme from "@/schemes/restore.scheme";
import { RestoreFormData } from "@/types/auth.d";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import InputField from "../../form/InputField";
import SubmitButton from "../../form/SubmitButton";
import { usePathname } from "next/navigation";

const RestoreForm = () => {
  const { theme } = useTheme();
  const { slug } = useOrganization();
  const { userData } = useUser();
  const methods = useForm<RestoreFormData>({
    resolver: yupResolver(RestoreScheme),
  });
  const pathname = usePathname();
  const slugName = pathname?.split("/")[1] || slug;

  const { handleSubmit } = methods;

  const onSubmit = async (data: RestoreFormData) => {
    await toast
      .promise(
        httpInternalApi.httpPostPublic("/auth/restore_password", "POST", {
          email: data.email,
          code: data.code,
          password: data.password,
          password_confirmation: data.password_confirmation,
        }),
        {
          loading: "Restoring password...",
          success: "Password restored successful!",
          error: "Failed to restore password.",
        }
      )
      .then(() => {
        window.location.href = `/${slugName}/users`;
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
        className={`w-full flex flex-col items-center justify-center w-full gap-5 sm:gap-6 ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        {userData?.email ? (
          <input
            type="hidden"
            {...methods.register("email")}
            value={userData.email}
          />
        ) : (
          <div className="w-[65%] flex items-center justify-center">
            <InputField
              type="email"
              fieldName="email"
              label="Correo electrónico"
              placeholder="ejemplo@correo.com"
            />
          </div>
        )}
        <div className="w-[65%] flex items-center justify-center bg-transparent">
          <InputField
            type="text"
            fieldName="code"
            label="Código"
            placeholder={`X9X99W`}
          />
        </div>

        <div className="w-[65%] flex items-center justify-center">
          <InputField
            type="password"
            fieldName="password"
            label="Nueva contraseña"
            placeholder="********"
          />
        </div>

        <div className="w-[65%] flex items-center justify-center">
          <InputField
            type="password"
            fieldName="password_confirmation"
            label="Confirmar contraseña"
            placeholder="********"
          />
        </div>

        <div className="w-[75%] flex items-center justify-center">
          <SubmitButton
            label="Confirmar"
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

export default RestoreForm;
