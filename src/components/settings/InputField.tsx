import React from "react";

interface InputFieldProps {
  label: string;
  value?: string | number;
  onChange: (value: string | number | File) => void;
  type?: "text" | "number" | "file";
  textarea?: boolean;
  accept?: string; // <- NUEVO
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
          value={value}
          onChange={handleInputChange}
        />
      ) : (
        <input
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
