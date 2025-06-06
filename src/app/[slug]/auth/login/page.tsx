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
      className="w-full flex flex-1 items-center justify-center px-4 py-12 from-gray-900 via-black to-gray-800"
    >
      <div className="w-full min-w-[40%] max-w-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-8 dark:bg-black/20">
        <h1 className="text-center text-3xl font-bold text-electric-blue mb-6">
          {data?.name || "Klipper"}
        </h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
