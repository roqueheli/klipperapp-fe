"use client";

import { Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <main className="w-full relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] overflow-hidden px-4">
      {/* Glows */}
      <div className="absolute top-20 left-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-300/20 rounded-full blur-2xl animate-ping" />

      {/* Card */}
      <div className="relative z-10 max-w-xl w-full p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-xl text-center">
        <div className="mb-6 flex justify-center">
          <Sparkles className="text-pink-400 animate-fade-in-up" size={44} />
        </div>

        <h1 className="text-7xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-indigo-500 mb-4">
          404
        </h1>

        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
          ¡Página no encontrada!
        </h2>

        <p className="text-white/80 text-base md:text-lg mb-8 max-w-md mx-auto">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
      </div>
    </main>
  );
}
