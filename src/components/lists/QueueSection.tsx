import { User } from "@/types/user";

interface Props {
  queue: User[];
}

export default function QueueSection({ queue }: Props) {
  return (
    <section className="col-span-1 bg-[--cyber-gray] border border-[--electric-blue] rounded-xl p-5 shadow-md shadow-[--electric-blue]/30 max-h-[80vh] overflow-y-auto">
      <h2 className="text-lg font-semibold text-[--electric-blue] mb-4">
        👩‍💻 Orden Profesionales
      </h2>
      <ul className="space-y-3">
        {queue.length > 0 ? (
          queue.map((user) => (
            <li
              key={user.id}
              className="rounded-md bg-[--background] text-[--foreground] p-3 shadow hover:bg-[--menu-hover-bg] transition-colors text-sm"
            >
              {user.name}
            </li>
          ))
        ) : (
          <li className="text-sm italic text-[--soft-white]/60">
            No hay profesionales sin clientes.
          </li>
        )}
      </ul>
    </section>
  );
}
