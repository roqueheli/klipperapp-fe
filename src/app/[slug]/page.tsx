"use client";

import { useOrganization } from "@/contexts/OrganizationContext";
import { isValidOrganization } from "@/utils/organization.utils";
import { Sparkles } from "lucide-react";
import { redirect } from "next/navigation";

const OrganizationPage = () => {
  const { slug, data } = useOrganization();

  if (!isValidOrganization(data)) {
    return (
      <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] overflow-hidden">
        {/* Glowing Circles */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-cyan-400/20 rounded-full blur-2xl animate-ping" />

        {/* Card */}
        <div className="relative z-10 p-10 rounded-3xl shadow-2xl border border-white/10 bg-white/5 backdrop-blur-lg text-center max-w-xl">
          <div className="flex justify-center mb-4">
            <Sparkles className="text-orange-400 animate-fade-in-up" size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-blue-400 to-orange-400 drop-shadow">
            ¡Organización no encontrada!
          </h1>
          <p className="mt-6 text-sm md:text-base text-white/80">
            La organización que buscas no existe o no está disponible. Verifica
            el URL o contacta a soporte para asistencia.
          </p>
        </div>
      </main>
    );
  }

  return redirect(`/${slug}/users`);
};

export default OrganizationPage;
