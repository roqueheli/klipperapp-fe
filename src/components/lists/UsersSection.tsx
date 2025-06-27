import { AttendanceProfile } from "@/types/attendance";
import { User, UserWithProfiles } from "@/types/user";
import { Users } from "lucide-react";
import UserProfileCard from "./UserProfileCard";

interface Props {
  users: UserWithProfiles[];
  onUserClick: (
    userId: number,
    userName: string,
    att: AttendanceProfile
  ) => void;
  userLogged?: User;
}

export default function UsersSection({
  users,
  onUserClick,
  userLogged,
}: Props) {
  return (
    <section className="col-span-1 md:col-span-3 space-y-6">
      <div className="flex items-center gap-2 text-xl font-bold text-[--accent-pink]">
        <Users className="w-5 h-5" />
        Turnos por Profesional
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {users
          .filter(
            (user) =>
              userLogged?.id === undefined || user.user.id === userLogged?.id
          )
          .map((user) => (
            <UserProfileCard
              key={user.user.id}
              user={user}
              onClick={onUserClick}
            />
          ))}
      </div>
    </section>
  );
}
