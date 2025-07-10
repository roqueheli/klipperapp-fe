import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Input } from "@/components/ui/Input";
import clsx from "clsx";

type InputFieldProps = {
  type: "text" | "password" | "date" | "email" | "file" | "url" | "tel" | "number" | "textarea";
  label: string;
  fieldName: string;
  placeholder?: string;
  styles?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rightElement?: React.ReactNode; // opcional override
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
  rightElement,
}: InputFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldError = errors[fieldName]?.message as string | undefined;

  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={clsx("w-full flex flex-col mt-4", styles)}>
      <label className="mb-1">{label}</label>

      <div className="relative">
        <Input
          {...register(fieldName)}
          type={inputType}
          className={clsx(
            "pr-10", // Add padding for the icon
            { "border-red-500 focus:ring-red-500": fieldError }
          )}
          placeholder={placeholder ?? ""}
          defaultValue={value}
          onChange={onChange}
          disabled={disabled}
        />

        <div className="absolute inset-y-0 right-2 flex items-center text-xl">
          {rightElement ? (
            rightElement
          ) : isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-gray-500 hover:text-gray-600 transition-all"
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          ) : null}
        </div>
      </div>

      {fieldError && <span className="text-red-500 text-sm">{fieldError}</span>}
    </div>
  );
};

export default InputField;