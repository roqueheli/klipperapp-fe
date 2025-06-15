import { useFormContext } from "react-hook-form";

type InputFieldProps = {
  type: "text" | "password" | "date" | "email" | "file" | "url" | "tel";
  label: string;
  fieldName: string;
  placeholder?: string;
  styles?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputField = ({
  type,
  label,
  fieldName,
  placeholder,
  styles,
  value,
  disabled,
  onChange,
}: InputFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldError = errors[fieldName]?.message as string | undefined;

  return (
    <div className={`w-full flex flex-col mt-4 ${styles ?? ""}`}>
      <label className="mb-1">{label}</label>
      <input
        {...register(fieldName)}
        type={type}
        className="rounded-md p-2 bg-transparent border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue transition-all"
        placeholder={placeholder ?? ""}
        defaultValue={value}
        onChange={onChange}
        disabled={disabled}
      />
      {fieldError && <span className="text-red-500 text-sm">{fieldError}</span>}
    </div>
  );
};

export default InputField;
