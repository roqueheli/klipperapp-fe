"use client";

import LoginForm from "@/components/auth/login/LoginForm";
import { useOrganization } from "@/contexts/OrganizationContext";

const LoginPage = () => {
  const { data } = useOrganization();

  return (
    <div
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
      className="w-full min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-gray-900 via-black to-gray-800"
    >
      <div
        className="
          w-full 
          sm:max-w-sm 
          md:max-w-md 
          lg:max-w-lg 
          xl:max-w-xl 
          bg-white/10 
          backdrop-blur-md 
          border border-white/20 
          rounded-xl 
          shadow-lg 
          p-6 
          md:p-8 
          dark:bg-black/20
        "
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
