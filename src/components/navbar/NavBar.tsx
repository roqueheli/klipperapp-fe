"use client";

import { useTheme } from "@/components/ThemeProvider"; // Asegúrate que el path sea correcto
import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { MenuItem } from "@/types/user";
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

  useEffect(() => {
    if (!auth_token) {
      setRoute(`/auth/login`);
      router.replace(`/${slug}/auth/login`);
    }
  }, [router]);

  const roleId = userData?.role_id;

  const defaultMenus: MenuItem[] = [
    {
      label: "Asistencia",
      path: `/${slug}/users/arrivals`,
      allowedRoles: [1, 2],
    },
    {
      label: "Atención",
      path: `/${slug}/users/attendances`,
      allowedRoles: [1, 2],
    },
    { label: "Listas", path: `/${slug}/users/lists`, allowedRoles: [1, 2, 3] },
    {
      label: "Dashboard",
      path: `/${slug}/users/dashboard`,
      allowedRoles: [1, 2, 3],
    },
  ];

  const menus: MenuItem[] =
    data?.metadata?.menus?.length > 0
      ? (data?.metadata?.menus as MenuItem[])
      : defaultMenus;

  const filteredMenus = menus.filter((menu) =>
    menu.allowedRoles.includes(roleId || 0)
  );

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

  return (
    <nav className="w-full fixed top-0 left-0 z-50 px-6 py-2 flex justify-between items-center backdrop-blur-md bg-[rgba(255,255,255,0.7)] dark:bg-[rgba(18,18,18,0.7)] border-b border-[rgba(255,255,255,0.3)] dark:border-[rgba(255,255,255,0.1)] text-[var(--foreground)]">
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
                  {filteredMenus.map(({ path, label }) => (
                    <li key={label}>
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
                    </li>
                  ))}
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
