"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useFilteredMenusFromOrganization } from "@/hooks/useFilteredMenusFromOrganization";
import Image from "next/image";

const UsersPage = () => {
  const { data } = useOrganization();
  const filteredMenus = useFilteredMenusFromOrganization();

  if (!filteredMenus || filteredMenus.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#141e30] via-[#243b55] to-[#141e30] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* glowing circle */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-blue-400/10 rounded-full blur-2xl animate-ping" />

      <section className="relative z-10 max-w-4xl w-full bg-white/5 border border-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 sm:p-10 text-white space-y-6">
        {/* Organization Banner */}
        {data?.photo_url && (
          <div className="w-full overflow-hidden rounded-xl shadow-md">
            <Image
              src={data.photo_url}
              alt={`Imagen de ${data.name}`}
              width={800}
              height={500}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        )}

        {/* Org Info */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-wide bg-gradient-to-r from-white to-yellow-500 text-transparent bg-clip-text mb-2">
            {data?.name || "Organización"}
          </h1>
          {data?.bio && (
            <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto">
              {data.bio}
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default UsersPage;
