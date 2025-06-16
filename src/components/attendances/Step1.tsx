import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { StepHeader } from "./StepHeader";

interface Step1Props {
  phone: string;
  setPhone: (phone: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  error?: string | null;
}

export default function Step1({
  phone,
  setPhone,
  onSubmit,
  onBack,
  error,
}: Step1Props) {
  return (
    <div className="w-full max-w-md space-y-6">
      <StepHeader text="Ingresa tu número de teléfono" />
      <Input
        type="tel"
        placeholder="Ej: +56 9 1234 5678"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-between mt-4">
        <Button onClick={onBack}>
          Volver
        </Button>
        <Button onClick={onSubmit} disabled={!phone}>
          Siguiente
        </Button>
      </div>
    </div>
  );
}
