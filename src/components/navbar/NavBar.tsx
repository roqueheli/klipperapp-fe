"use client";

import { useTheme } from "@/components/ThemeProvider";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import { useFilteredMenus } from "@/hooks/useFilteredMenus";
import { useIsWorkingTodayEmpty } from "@/hooks/useIsWorkingTodayEmpty";
import httpInternalApi from "@/lib/common/http.internal.service";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type NavBarProps = {
  auth_token?: string;
};

const NavBar = ({ auth_token }: NavBarProps) => {
  const { data, slug } = useOrganization();
  const { userData } = useUser();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const [route, setRoute] = useState("/users");
  const filteredMenus = useFilteredMenus();
  const isWorkingTodayEmpty = useIsWorkingTodayEmpty();

  useEffect(() => {
    if (!auth_token) {
      setRoute(`/auth/login`);
      router.replace(`/${slug}/auth/login`);
    }
  }, [auth_token, router, slug]);

  const initials = userData?.name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    await toast
      .promise(
        httpInternalApi.httpPost("/auth/logout", "POST", undefined, auth_token),
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

  // Cerrar menú con click fuera y tecla Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <nav className="w-full z-50 px-6 py-3 flex justify-between items-center backdrop-blur-md bg-[rgba(255,255,255,0.85)] dark:bg-[rgba(18,18,18,0.85)] border-b border-[rgba(255,255,255,0.15)] dark:border-[rgba(255,255,255,0.05)] text-[var(--foreground)] fixed top-0 left-0">
      <Link
        href={`/${slug}${route}`}
        className="ml-4 flex items-center text-xl font-extrabold tracking-wide hover:text-[var(--foreground)] transition-colors duration-200"
        aria-label="Home"
      >
        <Image
          src="/russo_logo.jpeg"
          alt="KlipperApp Logo"
          width={45}
          height={45}
          className="rounded-full"
        />
        <span className="ml-4">{data?.name}</span>
      </Link>

      <div className="flex items-center gap-5">
        {/* Toggle theme */}
        <button
          onClick={toggleTheme}
          className="text-3xl focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--accent)] rounded-md transition cursor-pointer"
          title="Toggle dark mode"
          aria-pressed={theme === "dark"}
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {/* User menu */}
        {auth_token && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={toggleMenu}
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--accent)] transition-colors"
              style={{ backgroundColor: "var(--cyber-gray)" }}
              aria-haspopup="true"
              aria-expanded={menuOpen}
              aria-label="User menu"
              tabIndex={0}
            >
              {initials}
            </button>

            <ul
              className={clsx(
                "absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-20 border border-[var(--menu-border)] bg-[var(--menu-bg)] transition-opacity duration-200",
                menuOpen
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              )}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
            >
              {filteredMenus.map(({ path, label }) => {
                const isDisabledAttention =
                  path.includes("/users/attendances") && isWorkingTodayEmpty;

                return (
                  <li key={label} role="none">
                    {isDisabledAttention ? (
                      <div
                        className="block px-4 py-2 rounded-md cursor-not-allowed text-electric-blue/50 bg-electric-blue/10 relative group select-none"
                        role="menuitem"
                        aria-disabled="true"
                        tabIndex={-1}
                      >
                        {label}
                        <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-red-500 text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none">
                          Debe registrar asistencia primero
                        </span>
                      </div>
                    ) : (
                      <Link
                        href={path}
                        className="block px-4 py-2 rounded-sm text-white shadow-md hover:scale-105 hover:shadow-xl dark:from-blue-700 dark:to-blue-900 transition-all duration-200"
                        role="menuitem"
                        tabIndex={0}
                        onClick={() => setMenuOpen(false)}
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                );
              })}
              <li role="none">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-left w-full block px-4 py-2 text-white hadow-md hover:scale-105 hover:shadow-xl dark:from-blue-700 dark:to-blue-900 transition-all duration-200"
                  role="menuitem"
                  tabIndex={0}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
