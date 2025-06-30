"use client";

import LoginForm from "@/components/auth/login/LoginForm";
import { useTheme } from "@/components/ThemeProvider";
import { useOrganization } from "@/contexts/OrganizationContext";

const LoginPage = () => {
  const { data } = useOrganization();
  const { theme } = useTheme();

  return (
    <div
      className={`shadow-xl w-full min-h-screen flex items-center justify-center px-4 py-8 ${theme === 'dark' ? "from-gray-900 via-black to-gray-800 text-white" : "bg-gradient-to-br from-gray-100 via-white to-gray-200 text-gray-900"}`}
    >
      <div
        className={`w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl ${theme === 'dark' ? "bg-gray-900/70 border-white/10" : "bg-white border-gray-200/10"} backdrop-blur-md border rounded-xl shadow-xl p-6 md:p-8`}
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
