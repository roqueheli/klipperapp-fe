import { AttendanceProfile } from "@/app/[slug]/users/lists/page";
import { UserWithProfiles } from "@/types/user";

interface Props {
  user: UserWithProfiles;
  onClick: (userId: number, userName: string, att: AttendanceProfile) => void;
}

export default function UserProfileCard({ user, onClick }: Props) {
  return (
    <article className="bg-[--cyber-gray] border border-[--electric-blue] rounded-xl p-5 shadow-md shadow-[--electric-blue]/30 flex flex-col">
      <h3 className="text-md font-bold text-[--electric-blue] mb-3">
        {user.user.name}{" "}
        <span className="text-sm font-normal text-[--soft-white]">
          ({user.profiles.length})
        </span>
      </h3>
      <ul className="space-y-3 max-h-[300px] overflow-y-auto p-2">
        {user.profiles.length > 0 ? (
          user.profiles.map((att, index) => {
            const isClickable = index === 0;
            const statusColor = {
              pending: "orange",
              processing: "green",
              finished: "gray",
            }[att.status || "pending"];

            return (
              <li
                key={att.id}
                onClick={() =>
                  isClickable && onClick(user.user.id, user.user.name, att as any)
                }
                className={`mb-5 flex items-center space-x-3 rounded-md p-3 text-xs text-[--foreground] shadow-[0_2px_8px_rgba(61,217,235,0.3)] transition-shadow select-none ${
                  isClickable
                    ? "cursor-pointer bg-[--background] hover:shadow-[0_2px_12px_rgba(61,217,235,0.5)]"
                    : "cursor-not-allowed bg-gray-800 opacity-50"
                }`}
                title={`Atención: ${att.name} - Estado: ${att.status}`}
              >
                <span className="font-medium flex-grow">{att.name}</span>
                <span className="relative flex h-3 w-3 shrink-0">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${statusColor}-400 opacity-75`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-3 w-3 bg-${statusColor}-500`}
                  />
                </span>
              </li>
            );
          })
        ) : (
          <li className="text-sm italic text-[--soft-white]/60">
            Sin clientes en espera
          </li>
        )}
      </ul>
    </article>
  );
}
