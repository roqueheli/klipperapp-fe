"use client";

import { useFilteredMenus } from "@/hooks/useFilteredMenus";
import { useIsWorkingTodayEmpty } from "@/hooks/useIsWorkingTodayEmpty";
import { MenuItem } from "@/types/user";
import Link from "next/link";

const UsersPage = () => {
  const filteredMenus = useFilteredMenus();
  const isWorkingTodayEmpty = useIsWorkingTodayEmpty();

  return (
    <div className="flex justify-center items-center from-gray-100 to-gray-300 dark:from-gray-900 dark:to-black px-6">
      <div className="w-full max-w-2xl bg-white/80 dark:bg-black/30 backdrop-blur-md border border-gray-300 dark:border-white/20 rounded-2xl shadow-xl p-12">
        <div className="flex flex-col items-center gap-6">
          {filteredMenus.map((menu: MenuItem, index: number) => {
            const isDisabledAttention =
              menu.path.includes("/users/attendances") && isWorkingTodayEmpty;

            const commonClasses =
              "w-64 text-center text-lg border border-gray-300 font-semibold py-4 px-8 rounded-xl shadow-md transition-all duration-300";

            if (isDisabledAttention) {
              return (
                <div
                  key={index}
                  className={`${commonClasses} cursor-not-allowed text-electric-blue/50 bg-electric-blue/5 dark:bg-electric-blue/10 relative group`}
                >
                  {menu.label}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-red-500 text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Debe registrar asistencia primero
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={index}
                href={menu.path}
                className={`${commonClasses} bg-electric-blue/10 dark:bg-electric-blue/20 
        hover:bg-electric-blue hover:text-white dark:hover:bg-blue-500/80 text-electric-blue cursor-pointer`}
              >
                {menu.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
