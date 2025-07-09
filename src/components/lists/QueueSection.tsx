"use client";

import { User } from "@/types/user";
import { UserCircle2, Users } from "lucide-react";
import { useMemo } from "react";
import { useTheme } from "../ThemeProvider";

interface Props {
  queue: User[];
}

// Función que genera colores pastel aleatorios
const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 70%)`; // tono pastel
};

export default function QueueSection({ queue }: Props) {
  const { theme } = useTheme();
  const userColors = useMemo(() => {
    const map = new Map<number, string>();
    queue.forEach((user) => {
      map.set(user.id, getRandomColor());
    });
    return map;
  }, [queue]);
  
  return (
    <section
      className={`
        col-span-1 
        rounded-2xl 
        p-6 
        overflow-y-auto 
        transition-colors duration-300
        ${theme === "dark" ? "ring-1 ring-[--electric-blue]/30 shadow-md dark:shadow-[0_0_20px_rgba(61,217,235,0.1)] dark:bg-gradient-to-br dark:from-[#0b0f1c] dark:via-[#12182f] dark:to-[#1a223a]" 
        : "bg-white border shadow-md"}
      `}
    >
      <header className="flex items-center flex-col justify-between mb-5">
        <h2 className="text-sm font-bold flex justify-start text-left gap-2">
          <Users className="w-5 h-5" />
          Orden de Profesionales
        </h2>
      </header>

      <ul className="space-y-4">
        {queue.length > 0 ? (
          queue.map((user) => (
            <li
              key={user.id}
              className={`flex items-center gap-3 p-4 rounded-lg shadow group transition 
              ${theme === "dark" ? "hover:shadow-[0_0_12px_rgba(61,217,235,0.3)] bg-gray-100 dark:bg-[#1f273d]" : "bg-gray-100"}
              `}
            >
              <UserCircle2
                className="w-6 h-6 group-hover:scale-110 transition-transform"
                style={{ color: userColors.get(user.id) }}
              />
              <span className="text-sm font-medium truncate">
                {user.name}
              </span>
            </li>
          ))
        ) : (
          <li className="text-sm italic text-center py-10">
            💤 No hay profesionales sin clientes en este momento.
          </li>
        )}
      </ul>
    </section>
  );
}
