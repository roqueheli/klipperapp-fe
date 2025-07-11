import React from "react";
import { Input } from "@/components/ui/Input";

interface InputFieldProps {
  label: string;
  value?: string | number;
  onChange: (value: string | number | File) => void;
  type?: "text" | "number" | "file" | "password";
  textarea?: boolean;
  accept?: string;
}
export default function InputField({
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
  accept,
}: InputFieldProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (
      type === "file" &&
      e.target instanceof HTMLInputElement &&
      e.target.files
    ) {
      onChange(e.target.files[0]); // Enviamos el File
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1 text-sm text-[--electric-blue]">
        {label}
      </label>
      {textarea ? (
        <textarea
          className="w-full p-3 border rounded-md bg-[--background] text-[--foreground] border-gray-300 dark:border-gray-600"
          value={value as string}
          onChange={handleInputChange}
        />
      ) : (
        <Input
          type={type}
          className="w-full p-3 border rounded-md bg-[--background] text-[--foreground] border-gray-300 dark:border-gray-600"
          value={type === "file" ? undefined : value}
          onChange={handleInputChange}
          accept={type === "file" ? accept : undefined}
        />
      )}
    </div>
  );
}