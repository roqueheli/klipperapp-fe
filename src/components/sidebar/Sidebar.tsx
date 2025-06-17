"use client";

import { useTheme } from "@/components/ThemeProvider";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import { useFilteredMenus } from "@/hooks/useFilteredMenus";
import { useIsWorkingTodayEmpty } from "@/hooks/useIsWorkingTodayEmpty";
import httpInternalApi from "@/lib/common/http.internal.service";
import clsx from "clsx";
import {
  BarChart3,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  History,
  ListOrdered,
  LogIn,
  Settings,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { JSX, useEffect, useState } from "react";
import toast from "react-hot-toast";

type SidebarProps = {
  token?: string;
};

export default function Sidebar({ token }: SidebarProps) {
  const { slug, data } = useOrganization();
  const { userData } = useUser();
  const { theme, toggleTheme } = useTheme();
  const menus = useFilteredMenus();
  const pathname = usePathname();
  const [route, setRoute] = useState("/users");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const isWorkingTodayEmpty = useIsWorkingTodayEmpty();

  const initials = userData?.name
    ?.split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const menuIcons: Record<string, JSX.Element> = {
    [`/${slug}/users/checkin`]: <LogIn className="h-5 w-5 shrink-0" />,
    [`/${slug}/users/attendances`]: (
      <CalendarCheck className="h-5 w-5 shrink-0" />
    ),
    [`/${slug}/users/lists`]: <ListOrdered className="h-5 w-5 shrink-0" />,
    [`/${slug}/transactions`]: <History className="h-5 w-5 shrink-0" />,
    [`/${slug}/users/dashboard`]: <BarChart3 className="h-5 w-5 shrink-0" />,
    [`/${slug}/users/settings`]: <Settings className="h-5 w-5 shrink-0" />,
  };

  useEffect(() => {
    if (!token) {
      setRoute(`/auth/login`);
      router.replace(`/${slug}/auth/login`);
    }
  }, [token, router, slug]);

  const handleLogout = async () => {
    await toast
      .promise(
        httpInternalApi.httpPost("/auth/logout", "POST", undefined, token),
        {
          loading: "Logging out...",
          success: "Logged out successfully!",
          error: "Failed to logout. Please try again.",
        }
      )
      .then(() => {
        router.push(`/${slug}/auth/login`);
      });
  };

  const configMenu = menus.find((m) => m.label === "Configuración");
  const otherMenus = menus.filter((m) => m.label !== "Configuración");

  return (
    <aside
      className={clsx(
        "min-h-screen bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-4 flex flex-col justify-between transition-all duration-300 ease-in-out",
        isOpen ? "w-70" : "w-16"
      )}
    >
      {/* Toggle */}
      <div className="flex justify-end">
        <button
          className="mb-4 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Logo */}
      <Link
        href={`/${slug}${route}`}
        className="mb-6 flex items-center text-md font-extrabold tracking-wide transition-colors"
        aria-label="Home"
      >
        <Image
          src="/russo_logo.jpeg"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
        {isOpen && <span className="ml-4">{data?.name}</span>}
      </Link>

      {/* Menús */}
      <nav className="space-y-3 flex-1">
        {otherMenus.map((menu) => {
          const isDisabledAttention =
            menu.path.includes("/users/attendances") && isWorkingTodayEmpty;

          const isActive = pathname === menu.path;

          return (
            <div key={menu.path} className="relative group">
              <Link
                href={isDisabledAttention ? "#" : menu.path}
                onClick={(e) => {
                  if (isDisabledAttention) {
                    e.preventDefault();
                  }
                }}
                className={clsx(
                  "flex items-center gap-3 px-2 py-2 rounded transition-colors",
                  isActive
                    ? "bg-gray-100 dark:bg-gray-700 font-semibold"
                    : "text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700",
                  isDisabledAttention &&
                    "cursor-not-allowed opacity-50 pointer-events-auto"
                )}
              >
                {menuIcons[menu.path]}
                {isOpen && <span>{menu.label}</span>}
              </Link>

              {isDisabledAttention && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-red-500 text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  Debe registrar asistencia primero
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Configuración, tema, avatar, logout */}
      <div className="space-y-3">
        {configMenu && (
          <Link
            href={configMenu.path}
            className={clsx(
              "flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
              pathname === configMenu.path
                ? "bg-gray-100 dark:bg-gray-700 font-semibold"
                : "text-gray-700 dark:text-white"
            )}
          >
            {menuIcons[configMenu.path]}
            {isOpen && <span>{configMenu.label}</span>}
          </Link>
        )}

        {/* Toggle theme */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-full"
          title="Toggle dark mode"
        >
          <span className="text-xl">{theme === "dark" ? "☀️" : "🌙"}</span>
          {isOpen && <span>{theme === "dark" ? "Claro" : "Oscuro"}</span>}
        </button>

        {/* Avatar e Logout */}
        <div className="flex items-center gap-3 px-2 py-2">
          {/* Avatar */}
          <div
            className="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold"
            style={{ backgroundColor: "var(--cyber-gray, #555)" }}
          >
            {initials}
          </div>

          {/* Botón Logout */}
          <button
            onClick={handleLogout}
            className={clsx(
              "text-sm text-red-600 dark:text-red-400 px-2 py-2 rounded hover:text-white hover:bg-red-100 dark:hover:bg-red-800 transition-colors w-full flex items-center justify-center"
            )}
          >
            {isOpen ? "Cerrar sesión" : <LogIn className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </aside>
  );
}
