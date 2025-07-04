"use client";

import { useTheme } from "@/components/ThemeProvider";
import { useBranch } from "@/contexts/BranchContext";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import { useFilteredMenusFromOrganization } from "@/hooks/useFilteredMenusFromOrganization";
import httpInternalApi from "@/lib/common/http.internal.service";
import clsx from "clsx";
import {
  BarChart3,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileBarChart2,
  History,
  ListOrdered,
  LogIn,
  LogOut,
  Settings,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { JSX, useEffect, useState } from "react";
import toast from "react-hot-toast";

type SidebarProps = {
  token?: string;
  isWorkingTodayEmpty: boolean;
};

const iconMap: Record<string, JSX.Element> = {
  LogIn: <LogIn className="h-5 w-5 shrink-0" />,
  CalendarCheck: <CalendarCheck className="h-5 w-5 shrink-0" />,
  ListOrdered: <ListOrdered className="h-5 w-5 shrink-0" />,
  History: <History className="h-5 w-5 shrink-0" />,
  BarChart3: <BarChart3 className="h-5 w-5 shrink-0" />,
  Clock: <Clock className="h-5 w-5 shrink-0" />,
  Settings: <Settings className="h-5 w-5 shrink-0" />,
  FileBarChart2: <FileBarChart2 className="h-5 w-5 shrink-0" />,
  Wallet: <Wallet className="h-5 w-5 shrink-0" />,
};

export default function Sidebar({ token, isWorkingTodayEmpty }: SidebarProps) {
  const { slug, data } = useOrganization();
  const { userData } = useUser();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [route, setRoute] = useState("/users");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  const initials = userData?.name
    ?.split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const menus = useFilteredMenusFromOrganization();
  const configMenu = menus.find((m) => m.label === "Configuración");
  const otherMenus = menus.filter((m) => m.label !== "Configuración");
  const { branches, selectedBranch, setSelectedBranch } = useBranch();

  useEffect(() => {
    if (!token) {
      setRoute(`/auth/login`);
      router.replace(`/${slug}/auth/login`);
    }
  }, [token, router, slug]);

  useEffect(() => {
    const handleResize = () => {
      const shouldBeOpen = window.innerWidth >= 768;
      setIsOpen(shouldBeOpen);
    };

    // Defer to client
    if (typeof window !== "undefined") {
      handleResize(); // Ejecutar al montar
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

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
        sessionStorage.removeItem("attendancesData");
        sessionStorage.removeItem("attendancesPage");
        sessionStorage.removeItem("attendancesFilters");
        sessionStorage.removeItem("attendancesHasSearched");
        window.location.href = `/${slug}/auth/login`;
      });
  };

  if (isOpen === null) return null;

  return (
    <aside
      className={clsx(
        "min-h-screen border-r p-4 flex flex-col justify-between transition-all duration-300 ease-in-out",
        isOpen ? "w-90" : "w-16",
        theme === "dark"
          ? "bg-gray-900 dark:bg-gray-800 dark:border-gray-700"
          : "bg-white border-gray-300"
      )}
    >
      {/* Toggle */}
      <div
        className={`flex ${
          isOpen ? "justify-end" : "justify-center"
        } block xs:hidden`}
      >
        <button
          className={`mb-2 ${
            theme === "dark"
              ? "text-white hover:text-gray-600"
              : "text-gray-500 hover:text-black"
          } transition`}
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
        className="mb-2 flex items-center text-md font-extrabold tracking-wide transition-colors"
        aria-label="Home"
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
          <Image
            src={data?.metadata?.media_configs?.logo_url ?? ""}
            alt="Logo"
            fill
            sizes="32px"
            className="object-cover"
          />
        </div>
        {isOpen && <span className="ml-4">{data?.name}</span>}
      </Link>

      {/** Sucursal/es */}
      {isOpen && selectedBranch && (
        <div className="mb-2">
          <select
            value={selectedBranch?.id}
            onChange={(e) => {
              const selected = branches.find(
                (b) => b.id === Number(e.target.value)
              );
              if (selected) setSelectedBranch(selected);
            }}
            disabled={userData?.role.name !== "admin"} // ❗ esto evita la doble estructura
            className={clsx(
              "w-full px-3 py-2 text-sm rounded border",
              theme === "dark"
                ? "bg-gray-700 text-white border-gray-500"
                : "bg-white text-black"
            )}
          >
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          {userData?.role.name !== "admin" && (
            <p className="text-xs text-gray-500 mt-1 ml-1 italic">
              Solo puedes acceder a esta sucursal
            </p>
          )}
        </div>
      )}

      {/* Menús */}
      <nav className="space-y-3 flex-1">
        {otherMenus.map((menu) => {
          const shouldDisable =
            menu.path.includes("/users/attendances") && isWorkingTodayEmpty;
          const isActive = pathname === menu.path;

          return (
            <div key={menu.path} className="relative group">
              <Link
                href={shouldDisable ? "#" : menu.path}
                onClick={(e) => {
                  if (shouldDisable) e.preventDefault();
                }}
                className={clsx(
                  "flex items-center gap-3 px-2 py-2 rounded transition-colors",
                  theme === "dark"
                    ? isActive
                      ? "bg-gray-700 text-white"
                      : "bg-gray-800 text-white dark:hover:bg-gray-700"
                    : isActive
                    ? "bg-gray-200 text-gray-700"
                    : "bg-white text-gray-700 hover:bg-gray-200",
                  shouldDisable && "cursor-not-allowed opacity-50"
                )}
              >
                {iconMap[menu.icon] || null}
                {isOpen && <span>{menu.label}</span>}
              </Link>

              {shouldDisable && (
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
              "flex items-center gap-3 px-2 py-2 rounded transition-colors",
              theme === "dark"
                ? "bg-gray-800 text-white dark:hover:bg-gray-700"
                : "bg-white text-gray-700 hover:bg-gray-200"
            )}
            style={{
              color: theme === "dark" ? "white" : "black",
            }}
          >
            {iconMap[configMenu.icon] || null}
            {isOpen && <span>{configMenu.label}</span>}
          </Link>
        )}

        {/* Toggle theme */}
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-3 px-2 py-2 rounded transition-colors w-full 
            ${
              theme === "dark"
                ? "bg-gray-800 text-white dark:hover:bg-gray-700"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          title="Toggle dark mode"
        >
          <span className="text-xl">{theme === "dark" ? "☀️" : "🌙"}</span>
          {isOpen && <span>{theme === "dark" ? "Claro" : "Oscuro"}</span>}
        </button>

        {/* Avatar e Logout */}
        <div
          className={clsx(
            "flex w-full justify-between items-center gap-3 px-2 py-2 transition-all duration-300",
            isOpen ? "flex-col" : "flex-col justify-center"
          )}
        >
          <div
            className={`flex w-full ${
              !isOpen && "justify-center"
            } items-center gap-4`}
          >
            {userData?.photo_url ? (
              <div
                className={clsx(
                  "rounded-full overflow-hidden",
                  isOpen ? "w-12 h-12" : "w-10 h-10"
                )}
              >
                <Image
                  src={userData.photo_url}
                  alt="User Avatar"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                className={clsx(
                  "flex items-center justify-center font-bold rounded-full shrink-0",
                  theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-200 text-black",
                  isOpen ? "w-12 h-12 text-lg" : "w-8 h-8 text-sm"
                )}
              >
                {initials}
              </div>
            )}
            {isOpen && (
              <span
                className={`capitalize font-semibold px-5 py-1 rounded-lg text-xs inline-block ${
                  theme === "dark" ? "bg-gray-600" : "bg-gray-300"
                }`}
              >{`${userData?.role.name}`}</span>
            )}
          </div>

          {isOpen ? (
            <button
              onClick={handleLogout}
              className={clsx(
                "flex w-full items-center justify-center text-sm px-3 py-2 rounded transition-colors",
                theme === "dark"
                  ? "text-white bg-red-600 hover:text-red-600 hover:bg-gray-700 hover:border hover:border-red-600"
                  : "text-red-600 hover:text-white hover:bg-red-600 border border-red-400"
              )}
            >
              Cerrar sesión
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="mt-2 p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-full transition"
              title="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
