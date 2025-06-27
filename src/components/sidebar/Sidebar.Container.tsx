"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { useIsWorkingTodayEmpty } from "@/hooks/useIsWorkingTodayEmpty";

export default function SidebarContainer({ token }: { token?: string }) {
  const pathname = usePathname();
  const isLoginPage = pathname.includes("/auth/login");
  const isWorkingTodayEmpty = useIsWorkingTodayEmpty();

  if (isLoginPage) return null;

  return <Sidebar token={token} isWorkingTodayEmpty={isWorkingTodayEmpty} />;
}
