// components/settings/ImageUploader.tsx
"use client";

import httpInternalApi from "@/lib/common/http.internal.service";
import { Cloudinary } from "@/types/cloudinary";
import Image from "next/image";
import { useRef, useState } from "react";

interface ImageUploaderProps {
  label: string;
  initialUrl?: string;
  onUpload: (url: string) => void;
}

export default function ImageUploader({
  label,
  initialUrl,
  onUpload,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(initialUrl || null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const data = (await httpInternalApi.httpPostPublic(
        "/upload",
        "POST",
        formData
      )) as Cloudinary;

      if (!data?.secure_url)
        throw new Error("Falló la subida: secure_url no presente");

      setPreview(data?.secure_url);
      onUpload(data?.secure_url);
    } catch (err) {
      console.error("Error al subir imagen:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium block">{label}</label>
      <div className="flex items-center gap-4">
        {preview && (
          <Image
            src={preview}
            alt="Preview"
            width={64}
            height={64}
            className="rounded border"
          />
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="bg-[--electric-blue] hover:bg-[--menu-hover-bg] text-white font-semibold py-2 px-4 rounded transition"
        >
          {loading ? "Subiendo..." : "Seleccionar imagen"}
        </button>
      </div>
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
        ref={inputRef}
        onChange={handleFileChange}
      />
    </div>
  );
}
