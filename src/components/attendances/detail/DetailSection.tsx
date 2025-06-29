"use client";

import { useTheme } from "@/components/ThemeProvider";

interface DetailSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const DetailSection = ({ title, icon, children }: DetailSectionProps) => {
  const { theme } = useTheme();
  
  return (
    <section className={`mb-6 ${theme === "dark" ? "bg-gradient-to-br from-[#121826] via-[#1a2337] to-[#1e2b40] ring-white/10" : "bg-white ring-black/10"} rounded-2xl p-6 shadow-[0_4px_20px_rgba(61,217,235,0.08)] ring-1`}>
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
};

export default DetailSection;
