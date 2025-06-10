"use client";

import { useTheme } from "@/components/ThemeProvider"; // Asegúrate que el path sea correcto
import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import { useFilteredMenus } from "@/hooks/useFilteredMenus";
import { useIsWorkingTodayEmpty } from "@/hooks/useIsWorkingTodayEmpty";
import httpInternalApi from "@/lib/common/http.internal.service";
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
  }, [router]);
  
  const initials = userData?.name
    .split(" ") // separa por espacios
    .filter(Boolean) // elimina elementos vacíos
    .map((word) => word[0]) // toma la primera letra de cada palabra
    .slice(0, 2) // toma como máximo las dos primeras
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
        window.location.href = `/${slug}/auth/login`;
      });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // fixed top-0 left-0 

  return (
    <nav className="w-full z-50 px-6 py-2 flex justify-between items-center backdrop-blur-md bg-[rgba(255,255,255,0.7)] dark:bg-[rgba(18,18,18,0.7)] border-b border-[rgba(255,255,255,0.3)] dark:border-[rgba(255,255,255,0.1)] text-[var(--foreground)]">
      <Link
        href={`/${slug}${route}`}
        className="text-xl font-bold transition-colors duration-200 hover:text-[var(--foreground)]"
      >
        {data?.name}
      </Link>
      <div className="flex items-center gap-4">
        {/* Toggle theme */}
        <button
          onClick={toggleTheme}
          className="text-2xl focus:outline-none hover:opacity-80 transition cursor-pointer"
          title="Toggle dark mode"
          style={{ color: "var(--foreground)" }}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {/* User menu */}
        {auth_token && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={toggleMenu}
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold"
              style={{
                backgroundColor: "var(--cyber-gray)",
                color: "white",
              }}
            >
              {initials}
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10"
                style={{
                  backgroundColor: "var(--menu-bg)",
                  border: "1px solid var(--menu-border)",
                }}
              >
                <ul className="py-2">
                  {filteredMenus.map(({ path, label }, index) => {
                    const isDisabledAttention =
                      path.includes("/users/attendances") &&
                      isWorkingTodayEmpty;

                    return (
                      <li key={label}>
                        {isDisabledAttention ? (
                          <div className="block px-4 py-2 rounded-md cursor-not-allowed text-electric-blue/50 bg-electric-blue/5 dark:bg-electric-blue/10 relative group">
                            {label}
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-red-500 text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                              Debe registrar asistencia primero
                            </div>
                          </div>
                        ) : (
                          <Link
                            href={path}
                            className="block px-4 py-2 rounded-md transition-colors duration-200 text-[var(--foreground)] hover:bg-[var(--menu-hover-bg)] hover:text-[var(--hover-foreground)]"
                            onMouseEnter={(e) =>
                              ((e.target as HTMLElement).style.backgroundColor =
                                "var(--menu-hover-bg)")
                            }
                            onMouseLeave={(e) =>
                              ((e.target as HTMLElement).style.backgroundColor =
                                "transparent")
                            }
                          >
                            {label}
                          </Link>
                        )}
                      </li>
                    );
                  })}

                  <li>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="text-left w-full block px-4 py-2 rounded-md transition-colors duration-200 text-[var(--foreground)] hover:bg-[var(--menu-hover-bg)] hover:text-[var(--hover-foreground)]"
                      onMouseEnter={(e) =>
                        ((e.target as HTMLElement).style.backgroundColor =
                          "var(--menu-hover-bg)")
                      }
                      onMouseLeave={(e) =>
                        ((e.target as HTMLElement).style.backgroundColor =
                          "transparent")
                      }
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
