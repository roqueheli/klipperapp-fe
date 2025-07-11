import { Input } from "@/components/ui/Input";

type Props = {
  label: string;
  value: string | number;
  type: "date" | "number";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const InputFieldSimple = ({ label, value, type = 'date', onChange }: Props) => (
  <div className="w-full flex flex-col">
    <label className="mb-1">{label}</label>
    <Input type={type} value={value} onChange={onChange} />
  </div>
);
