"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function LogoutHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("logout") === "1") {
      sessionStorage.clear();
      localStorage.clear();
      document.cookie = "auth_token=; Max-Age=0; path=/;";
    }
  }, [searchParams]);

  return null;
}
