"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function SidebarContainer({ token }: { token?: string }) {
  const pathname = usePathname();
  const isLoginPage = pathname.includes("/auth/login");

  if (isLoginPage) return null;

  return <Sidebar token={token} />;
}
