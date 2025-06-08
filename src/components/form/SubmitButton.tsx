import { FieldValues, useFormContext } from "react-hook-form";

type SubmitButtonProps<T> = {
    label: string;
    styles?: string;
    onSubmit: (data: T) => void;
}

const SubmitButton = <T extends FieldValues,>({ label, styles, onSubmit }: SubmitButtonProps<T>) => {
    const { handleSubmit } = useFormContext<T>();

    return (
        <div className={`${styles ?? ''}`}>
            <button className="cursor-pointer" onClick={handleSubmit(onSubmit)} type="submit">{label}</button>
        </div>
    )
}

export default SubmitButton;