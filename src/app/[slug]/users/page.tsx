"use client";

import { useTheme } from "@/components/ThemeProvider";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import { useFilteredMenusFromOrganization } from "@/hooks/useFilteredMenusFromOrganization";
import { pusherClient } from "@/lib/pusher/pusher.client";
import { AttendanceCable } from "@/types/attendance";
import Image from "next/image";
import { useEffect } from "react";

const UsersPage = () => {
  const { data, slug } = useOrganization();
  const { theme } = useTheme();
  const { userData } = useUser();
  const filteredMenus = useFilteredMenusFromOrganization();

  useEffect(() => {
    const channel = pusherClient?.subscribe("attendance_channel");

    channel?.bind("attendance", function (attendance: AttendanceCable) {
      if (!attendance.id && userData?.role.name === "viewer") {
        window.location.href = `/${slug}/users/attendances`;
      }
    });

    return () => {
      // 🔒 Limpieza al desmontar
      channel?.unbind_all();
      channel?.unsubscribe();
    };
  }, []);

  if (!filteredMenus || filteredMenus.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <main
      className={`min-h-screen w-full flex items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden
      ${
        theme === "dark"
          ? "bg-gradient-to-br from-[#141e30] via-[#243b55] to-[#141e30]"
          : "bg-white border border-gray-200 shadow-xl"
      } transition-colors duration-500`}
    >
      {/* glowing circles */}
      <div className="absolute top-10 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-yellow-300/20 dark:bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-40 h-40 sm:w-60 sm:h-60 bg-blue-300/20 dark:bg-blue-400/10 rounded-full blur-2xl animate-ping" />

      <section
        className={`relative z-10 w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl
        ${
          theme === "dark"
            ? "bg-white/5 border-white/10 text-white"
            : "bg-white border-gray-200 text-gray-800"
        } border
        backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 space-y-4 sm:space-y-6 transition-all`}
      >
        {/* Organization Banner */}
        {data?.photo_url && (
          <div className="relative w-full max-h-[500px] aspect-[16/10] overflow-hidden rounded-xl shadow-md">
            <Image
              src={data.photo_url}
              alt={`Imagen de ${data.name}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 800px"
            />
          </div>
        )}

        {/* Organization Info */}
        <div className="text-center space-y-2 sm:space-y-3">
          <h1
            className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide text-transparent
            ${
              theme === "dark"
                ? "bg-gradient-to-r from-white to-yellow-500"
                : "bg-gradient-to-r from-yellow-600 to-blue-500"
            } bg-clip-text`}
          >
            {data?.name || "Organización"}
          </h1>
          {data?.bio && (
            <p
              className={`${
                theme === "dark" ? "text-white/80" : "text-gray-600"
              } text-xs sm:text-sm md:text-base max-w-xs sm:max-w-md md:max-w-2xl mx-auto`}
            >
              {data.bio}
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default UsersPage;
