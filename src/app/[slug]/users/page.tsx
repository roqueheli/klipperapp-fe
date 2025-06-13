"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useFilteredMenus } from "@/hooks/useFilteredMenus";
import { useIsWorkingTodayEmpty } from "@/hooks/useIsWorkingTodayEmpty";
import { MenuItem } from "@/types/user";
import Link from "next/link";

const UsersPage = () => {
  const filteredMenus = useFilteredMenus();
  const isWorkingTodayEmpty = useIsWorkingTodayEmpty();

  if (!filteredMenus || filteredMenus.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex justify-center items-center h-[80vh] w-full bg-gradient-to-br from-blue-100 to-blue-300 dark:from-gray-900 dark:to-black px-6 py-12">
      <div className="w-full max-w-2xl bg-white/90 dark:bg-gray-800/80 backdrop-blur-md border border-gray-300 dark:border-gray-700 rounded-3xl shadow-2xl p-10">
        <div className="flex flex-col items-center gap-8">
          {filteredMenus.map((menu: MenuItem, index: number) => {
            const isDisabledAttention =
              menu.path.includes("/users/attendances") && isWorkingTodayEmpty;

            const baseClasses =
              "w-72 text-center text-lg font-semibold py-4 px-10 rounded-2xl shadow-md transition transform duration-300 ease-in-out select-none";

            if (isDisabledAttention) {
              return (
                <div
                  key={index}
                  className={`${baseClasses} cursor-not-allowed text-blue-400 bg-blue-50 dark:bg-blue-900/20 relative group opacity-60`}
                >
                  {menu.label}
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-red-400 text-xs rounded-md py-1 px-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Debe registrar asistencia primero
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={index}
                href={menu.path}
                className={`${baseClasses} bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg hover:scale-105 hover:shadow-xl dark:from-blue-700 dark:to-blue-900 cursor-pointer`}
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
