import { AttendanceProfile } from "@/app/[slug]/users/lists/page";
import { UserWithProfiles } from "@/types/user";
import UserProfileCard from "./UserProfileCard";

interface Props {
  users: UserWithProfiles[];
  onUserClick: (
    userId: number,
    userName: string,
    att: AttendanceProfile
  ) => void;
}

export default function UsersSection({ users, onUserClick }: Props) {
  return (
    <section className="col-span-1 md:col-span-3 space-y-6">
      <h2 className="text-lg font-semibold text-[--accent-pink]">
        📦 Turnos por Profesional
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
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
