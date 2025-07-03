import { FieldValues, useFormContext } from "react-hook-form";

type SubmitButtonProps<T> = {
  label: string;
  styles?: string;
  type?: "submit";
  onSubmit: (data: T) => void;
};

const SubmitButton = <T extends FieldValues>({
  label,
  styles,
  type = "submit",
  onSubmit,
}: SubmitButtonProps<T>) => {
  const { handleSubmit } = useFormContext<T>();

  return (
    <div className={`${styles ?? ""}`}>
      <button
        onClick={handleSubmit(onSubmit)}
        type={type}
      >
        {label}
      </button>
    </div>
  );
};

export default SubmitButton;
