"use client";

import { User } from "@/types/user";
import { UserCircle2, Users } from "lucide-react";

interface Props {
  queue: User[];
}

export default function QueueSection({ queue }: Props) {
  return (
    <section className="col-span-1 bg-gradient-to-br from-[#0b0f1c] via-[#12182f] to-[#1a223a] ring-1 ring-[--electric-blue]/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(61,217,235,0.1)] max-h-[80vh] overflow-y-auto">
      <header className="flex items-center flex-col justify-between mb-5">
        <h2 className="text-md font-bold text-[--electric-blue] flex justify-start text-left gap-2">
          <Users className="w-5 h-5 text-[--electric-blue]" />
          Orden de Profesionales
        </h2>
      </header>

      <ul className="space-y-4">
        {queue.length > 0 ? (
          queue.map((user) => (
            <li
              key={user.id}
              className="flex items-center gap-3 p-4 bg-[#1f273d] rounded-lg shadow-md transition hover:shadow-[0_0_12px_rgba(61,217,235,0.3)] group"
            >
              <UserCircle2 className="w-6 h-6 text-[--accent-pink] group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-[--soft-white]">
                {user.name}
              </span>
            </li>
          ))
        ) : (
          <li className="text-sm italic text-[--soft-white]/50 text-center py-10">
            💤 No hay profesionales sin clientes en este momento.
          </li>
        )}
      </ul>
    </section>
  );
}
