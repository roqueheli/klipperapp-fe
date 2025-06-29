"use client";

import LoginForm from "@/components/auth/login/LoginForm";
import { useOrganization } from "@/contexts/OrganizationContext";

const LoginPage = () => {
  const { data } = useOrganization();

  return (
    <div
      className={`w-full min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-black dark:to-gray-800 text-gray-900 dark:text-white`}
    >
      <div
        className={`w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-white dark:bg-gray-900/70 backdrop-blur-md border border-gray-200 dark:border-white/20 rounded-xl shadow-lg p-6 md:p-8`}
      >
        <h1 className="w-full text-center text-2xl md:text-3xl font-bold text-electric-blue mb-4 md:mb-6">
          {data?.name || "Klipper"}
        </h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
