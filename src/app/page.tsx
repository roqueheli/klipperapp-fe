"use client";

import { useTheme } from "@/components/ThemeProvider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UnderConstructionPage() {
  const [slug, setSlug] = useState("");
  const router = useRouter();
  const { theme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (slug.trim()) {
      router.push(`/${slug.trim()}`);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900 px-4 text-center">
      <h1 className="text-3xl font-bold text-yellow-600 mb-4">
        🚧 Página en construcción
      </h1>

      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
        Estamos trabajando para traerte algo genial. Mientras tanto, puedes
        ingresar el alias de tu organización:
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-center gap-4 mb-8"
      >
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Ej: klipper-app"
          className={`px-4 py-2 rounded-md border text-gray-300 ${
            theme === "dark"
              ? "border-gray-700 placeholer:text-gray-400"
              : "border-gray-300 placeholder:text-gray-400"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
        >
          Entrar
        </button>
      </form>

      <div className="relative w-82 h-48 rounded-md shadow-md overflow-hidden">
        <Image
          src="https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif"
          alt="Trabajando en construcción"
          fill
          sizes="256px"
          className="object-cover"
        />
      </div>
    </div>
  );
}
