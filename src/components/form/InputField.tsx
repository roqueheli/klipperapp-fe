import { useFormContext } from "react-hook-form";

type InputFieldProps = {
  type: "text" | "password" | "date" | "email" | "file" | "url" | "tel";
  label: string;
  fieldName: string;
  placeholder?: string;
  styles?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputField = ({
  type,
  label,
  fieldName,
  placeholder,
  styles,
  value,
  onChange,
}: InputFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const fieldError = errors[fieldName]?.message as string | undefined;

  return (
    <div className={`w-[50%] flex flex-col mt-4 ${styles ?? ""}`}>
      <label className="mb-1">{label}</label>
      <input
        {...register(fieldName)}
        type={type}
        className="rounded-md p-2 bg-transparent border-2 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        placeholder={placeholder ?? ""}
        value={value}
        onChange={onChange}
      />
      {fieldError && <span className="text-red-500 text-sm">{fieldError}</span>}
    </div>
  );
};

export default InputField;
