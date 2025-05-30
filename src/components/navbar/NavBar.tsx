"use client";

import { useTheme } from "@/components/ThemeProvider"; // Asegúrate que el path sea correcto
import { useOrganization } from "@/contexts/OrganizationContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type NavBarProps = {
  first_name?: string;
  last_name?: string;
  auth_token?: string;
};

const NavBar = ({ first_name, last_name, auth_token }: NavBarProps) => {
  const { slug } = useOrganization();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { theme, toggleTheme } = useTheme();

  const userName = `${first_name || "John"} ${last_name || "Doe"}`.trim();
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("");

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
        router.push(`/${slug}/user`);
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
    <nav
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
      className="w-full shadow-md px-6 py-2 flex justify-between items-center"
    >
      <h1 className="text-xl font-bold">Barbería El Russo</h1>

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
        <div className="relative" ref={menuRef}>
          <button
            onClick={toggleMenu}
            className="w-10 h-12 rounded-full flex items-center justify-center font-bold"
            style={{
              backgroundColor: "var(--electric-blue)",
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
                {[
                  { href: `/${slug}/user/dashboard`, label: "Dashboard" },
                  { href: `/${slug}/tickets`, label: "Tickets" },
                  { href: `/${slug}/user/lists`, label: "Filas" },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="block px-4 py-2 hover:bg-opacity-20 transition cursor-pointer"
                      style={{
                        color: "var(--foreground)",
                      }}
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
                    className="text-left w-full block px-4 py-2 hover:bg-opacity-20 transition cursor-pointer"
                    style={{
                      color: "var(--foreground)",
                    }}
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
      </div>
    </nav>
  );
};

export default NavBar;
