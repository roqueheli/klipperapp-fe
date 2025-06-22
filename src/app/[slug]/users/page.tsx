"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useFilteredMenusFromOrganization } from "@/hooks/useFilteredMenusFromOrganization";
import { useIsWorkingTodayEmpty } from "@/hooks/useIsWorkingTodayEmpty";
import Image from "next/image";

const UsersPage = () => {
  const { data } = useOrganization();
  const filteredMenus = useFilteredMenusFromOrganization();
  const isWorkingTodayEmpty = useIsWorkingTodayEmpty();

  if (!filteredMenus || filteredMenus.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full bg-gradient-to-br from-gray-50 dark:from-gray-900 to-gray-200 dark:to-gray-800 px-4 sm:px-6 py-12">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 backdrop-blur-md border border-gray-300 dark:border-gray-700 rounded-3xl shadow-2xl p-6 sm:p-10">
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenus.map((menu: MenuItem, index: number) => {
            const isDisabledAttention = menu.path.includes("/users/attendances") && isWorkingTodayEmpty;
            const baseClasses =
              "w-full text-center text-base sm:text-lg font-semibold py-4 px-6 rounded-2xl shadow-md transition transform duration-300 ease-in-out select-none";

            if (isDisabledAttention) {
              return (
                <div
                  key={index}
                  className={`${baseClasses} cursor-not-allowed bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 relative group opacity-60`}
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
        </div> */}
        <Image src={data?.photo_url || ""} alt="Imagen principal" width={600} height={500} className="w-full rounded-lg" />
      </div>
    </div>
  );
};

export default UsersPage;
