"use client";

import { useTheme } from "@/components/ThemeProvider";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import { AccesDeniedError } from "@/lib/common/http.errors";
import httpInternalApi from "@/lib/common/http.internal.service";
import ChangeScheme from "@/schemes/change.scheme";
import { ChangeFormData } from "@/types/auth.d";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import InputField from "../../form/InputField";
import SubmitButton from "../../form/SubmitButton";

const ChangeForm = () => {
  const { theme } = useTheme();
  const { slug } = useOrganization();
  const { userData } = useUser();
  const methods = useForm<ChangeFormData>({
    resolver: yupResolver(ChangeScheme),
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: ChangeFormData) => {
    await toast
      .promise(
        httpInternalApi.httpPostPublic("/auth/change_password", "PATCH", {
          ...data,
          id: userData?.id,
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
        <div className="w-[65%] flex items-center justify-center">
          <InputField
            type="password"
            fieldName="old_password"
            label="Contraseña actual"
            placeholder="********"
          />
        </div>

        <div className="w-[65%] flex items-center justify-center">
          <InputField
            type="password"
            fieldName="new_password"
            label="Nueva contraseña"
            placeholder="********"
          />
        </div>

        <div className="w-[65%] flex items-center justify-center">
          <InputField
            type="password"
            fieldName="confirm_password"
            label="Confirmar contraseña"
            placeholder="********"
          />
        </div>

        <div className="w-[75%] flex items-center justify-center">
          <SubmitButton
            label="Cambiar contraseña"
            onSubmit={onSubmit}
            styles={`text-center md:w-[57%] sm:w-full ${
              theme === "dark"
                ? "text-gray-600 hover:bg-white shadow-xl"
                : "text-black hover:text-electric-blue"
            } bg-gray-300 transition-all font-semibold py-2 px-4 rounded-md mt-2`}
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default ChangeForm;
