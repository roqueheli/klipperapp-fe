"use client";

import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";

const ArrivalQRPage = () => {
  const [timestamp, setTimestamp] = useState("");
  const router = useRouter();

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleString();
    setTimestamp(formatted);
  }, []);

  const exampleValue = "https://example.com/checkin";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-6">
        Escanea para registrar tu llegada
      </h1>

      <QRCodeCanvas value={exampleValue} size={256} />

      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Código generado: {timestamp}
      </p>

      <button
        onClick={() => router.back()}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Volver
      </button>
    </div>
  );
};

export default ArrivalQRPage;
