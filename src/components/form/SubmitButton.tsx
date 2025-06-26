import { FieldValues, useFormContext } from "react-hook-form";

type SubmitButtonProps<T> = {
  label: string;
  styles?: string;
  type?: "submit" | "button";
  onClick?: () => void;
  onSubmit?: (data: T) => void;
};

const SubmitButton = <T extends FieldValues>({
  label,
  styles,
  type = "submit",
  onClick,
  onSubmit,
}: SubmitButtonProps<T>) => {
  const { handleSubmit } = useFormContext<T>();

  return (
    <div className={`${styles ?? ""}`}>
      <button
        onClick={onSubmit ? handleSubmit(onSubmit) : onClick}
        type={type}
      >
        {label}
      </button>
    </div>
  );
};

export default SubmitButton;
