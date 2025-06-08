"use client";

import InputField from "@/components/form/InputField";
import SubmitButton from "@/components/form/SubmitButton";
import { useOrganization } from "@/contexts/OrganizationContext";
import { AccesDeniedError } from "@/lib/common/http.errors";
import httpInternalApi from "@/lib/common/http.internal.service";
import RegisterScheme from "@/schemes/register.scheme";
import { RegisterData } from "@/types/auth.d";
import { ProfileResponse } from "@/types/profile";
import { yupResolver } from "@hookform/resolvers/yup";
import { usePathname, useRouter } from "next/navigation";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const RegisterForm = () => {
  const { slug, data } = useOrganization();
  const router = useRouter();
  const pathname = usePathname();
  const phone = localStorage.getItem("pendingPhone");
  const isProfileRegisterRoute = pathname === `/${slug}/profiles/register`;

  const methods = useForm<RegisterData>({
    resolver: yupResolver(RegisterScheme),
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<RegisterData> = async (
    registerData: RegisterData
  ) => {
    try {
      const response = await toast.promise(
        httpInternalApi.httpPostPublic("/profiles/register", "POST", {
          ...registerData,
          organization_id: data?.id,
        }) as Promise<ProfileResponse>,
        {
          loading: "Register in...",
          success: "Register successful!",
          error: "Failed to register.",
        }
      );

      if (response?.error) {
        toast.error(response.error);
        return;
      }
      localStorage.removeItem("pendingPhone");
      localStorage.setItem("userAttendance", JSON.stringify(response?.profile));
      router.push(`/${slug}/users/attendances`);
    } catch (error) {
      if (error instanceof AccesDeniedError) {
        toast.error("Access Denied");
      } else {
        toast.error("Internal server error");
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center flex-col w-full"
      >
        <InputField
          type="text"
          fieldName="name"
          label="Name"
          placeholder="Jhon Mayer"
        />
        <InputField
          type="text"
          fieldName="email"
          label="Email"
          placeholder={`jhonmayer@${slug}.com`}
        />
        {!isProfileRegisterRoute && (
          <>
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
          </>
        )}
        <InputField
          type="text"
          fieldName="phone_number"
          label="Phone Number"
          placeholder="9 1234 1234"
          value={phone || ""}
          disabled={phone ? true : false}
        />
        <InputField
          type="date"
          fieldName="birth_date"
          label="Birthdate"
          placeholder="31'-12-2000"
        />
        <div className="flex justify-between w-full max-w-md mt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer bg-white text-black hover:bg-white hover:text-electric-blue transition-all font-semibold py-2 px-6 rounded-md mt-8"
          >
            Volver
          </button>
          <SubmitButton
            label="Register"
            onSubmit={onSubmit}
            styles="cursor-pointer bg-white text-black hover:bg-white hover:text-electric-blue transition-all font-semibold py-2 px-6 rounded-md mt-8"
          />
        </div>

        {!isProfileRegisterRoute && (
          <div className="mt-4 text-sm text-gray-600">
            ¿Already have an account?{" "}
            <a
              href={`/${slug}/auth/login`}
              className="text-blue-500 hover:underline"
            >
              Login
            </a>
          </div>
        )}
      </form>
    </FormProvider>
  );
};

export default RegisterForm;
