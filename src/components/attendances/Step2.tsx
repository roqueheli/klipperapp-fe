import { User } from "@/types/user";
import { StepHeader } from "./StepHeader";
import { Profile } from "@/types/attendance";
import { Button } from "../ui/Button";


interface Step2Props {
  users: User[];
  selectedUserId: number | null;
  setSelectedUserId: (id: number) => void;
  onNext: () => void;
  onBack: () => void;
  disableBack?: boolean;
  profile: Profile;
}

export default function Step2({
  users,
  selectedUserId,
  setSelectedUserId,
  onNext,
  onBack,
  disableBack,
  profile,
}: Step2Props) {
  return (
    <div className="w-full max-w-md space-y-6">
      <StepHeader text={`Hola ${profile.name || profile.email}`} />
      <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
        ¿Quién te está atendiendo hoy?
      </p>
      <div className="grid grid-cols-1 gap-2">
        {users.map((u) => (
          <Button
            key={u.id}
            onClick={() => setSelectedUserId(u.id)}
            className="w-full"
          >
            {u.name}
          </Button>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <Button
          onClick={onBack}
          disabled={disableBack}
        >
          Volver
        </Button>
        <Button
          onClick={onNext}
          disabled={selectedUserId === null}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
