import { Service } from "@/types/service";
import { StepHeader } from "./StepHeader";
import { Profile } from "@/types/attendance";
import { Button } from "../ui/Button";


interface Step3Props {
  services: Service[];
  selectedServiceId: number | null;
  setSelectedServiceId: (id: number) => void;
  onBack: () => void;
  onFinish: () => void;
  profile: Profile;
}

export default function Step3({
  services,
  selectedServiceId,
  setSelectedServiceId,
  onBack,
  onFinish,
  profile,
}: Step3Props) {
  return (
    <div className="w-full max-w-md space-y-6">
      <StepHeader text="Selecciona un servicio" />
      <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
        ¿Qué servicio vas a utilizar hoy, {profile.name || profile.email}?
      </p>
      <div className="grid grid-cols-1 gap-2">
        {services.map((s) => (
          <Button
            key={s.id}
            onClick={() => setSelectedServiceId(s.id)}
            className="w-full"
          >
            {s.name}
          </Button>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <Button onClick={onBack}>
          Volver
        </Button>
        <Button onClick={onFinish} disabled={selectedServiceId === null}>
          Finalizar
        </Button>
      </div>
    </div>
  );
}
