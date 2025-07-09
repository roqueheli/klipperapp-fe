import { AttendanceProfile } from "@/types/attendance";
import { UserWithProfiles } from "@/types/user";
import { UserCircle2 } from "lucide-react";
import { useTheme } from "../ThemeProvider";

interface Props {
  user: UserWithProfiles;
  onClick: (userId: number, userName: string, att: AttendanceProfile) => void;
}

const statusClasses = {
  pending: { ping: "bg-orange-400", dot: "bg-orange-500" },
  processing: { ping: "bg-green-400", dot: "bg-green-500" },
  finished: { ping: "bg-gray-400", dot: "bg-gray-500" },
  postponed: { ping: "bg-gray-300", dot: "bg-gray-400" },
} as const;

export default function UserProfileCard({ user, onClick }: Props) {
  const { theme } = useTheme();

  return (
    <article
      className={`transition-shadow duration-300 flex flex-col h-full rounded-2xl p-5 shadow-xl ${
        theme === "dark"
          ? "bg-gradient-to-br from-[#101522] via-[#1a2337] to-[#202a45] ring-1 ring-[--electric-blue]/30 shadow-[0_8px_24px_rgba(61,217,235,0.2)] hover:shadow-[0_12px_36px_rgba(61,217,235,0.35)]"
          : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-bold flex items-center gap-2">
          <UserCircle2 className="w-5 h-5" />
          <span className="truncate">{user.user.name.split(" ")[0]}</span>
        </h3>
        <span className="truncate text-xs">
          {user.profiles.length} turno(s)
        </span>
      </div>

      <ul className="space-y-3 max-h-[300px] overflow-y-auto p-1">
        {user.profiles.length > 0 ? (
          user.profiles.map((att) => {
            const statusClass =
              statusClasses[att.status as keyof typeof statusClasses] ??
              statusClasses.pending;
            const { ping, dot } = statusClass;

            return (
              <li
                key={att.id}
                onClick={() =>
                  att.clickeable &&
                  onClick(
                    user.user.id,
                    user.user.name,
                    att as AttendanceProfile
                  )
                }
                className={`flex items-center justify-between gap-3 rounded-md p-3 text-sm capitalize transition select-none ${
                  att.clickeable
                    ? `cursor-pointer shadow-md shadow-[0_4px_16px_rgba(61,217,235,0.2)] hover:shadow-[0_6px_24px_rgba(131,175,175,0.5)] hover:translate-x-0.5 ${
                        theme === "dark" && "bg-[#131b2c]"
                      }`
                    : `cursor-not-allowed shadow-md ${
                        theme === "dark" ? "bg-[#1e273b]" : "bg-white"
                      } opacity-50`
                }`}
                title={`Atención: ${att.name} - Estado: ${att.status}`}
              >
                <span className="truncate font-medium capitalize">
                  {att.name}
                </span>
                <span className="relative flex h-3 w-3 shrink-0">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full ${ping} opacity-75`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-3 w-3 ${dot}`}
                  />
                </span>
              </li>
            );
          })
        ) : (
          <li className="text-sm italic text-[--soft-white]/60 py-3 text-center">
            Sin clientes en espera.
          </li>
        )}
      </ul>
    </article>
  );
}
