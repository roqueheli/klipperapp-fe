"use client";

import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import { MenuItem } from "@/types/user";
import Link from "next/link";

const UsersPage = () => {
  const { slug, data } = useOrganization();
  const { userData } = useUser();
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

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-black px-6">
      <div className="w-full max-w-2xl bg-white/80 dark:bg-black/30 backdrop-blur-md border border-gray-300 dark:border-white/20 rounded-2xl shadow-xl p-12">
        <div className="flex flex-col items-center gap-6">
          {filteredMenus.map((menu: MenuItem, index: number) => (
            <Link
              key={index}
              href={menu.path}
              className="w-64 text-center text-lg border-1 border-gray-300 bg-electric-blue/10 dark:bg-electric-blue/20 
                        hover:bg-electric-blue hover:text-white dark:hover:bg-blue-500/80 text-electric-blue 
                        font-semibold py-4 px-8 rounded-xl shadow-md transition-all duration-300 cursor-pointer"
            >
              {menu.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
