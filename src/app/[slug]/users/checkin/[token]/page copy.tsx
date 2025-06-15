"use client";

import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { UserResponse } from "@/types/user";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";

const CheckinQRPage = () => {
  const { slug, data } = useOrganization();
  const { userData } = useUser();
  const [timestamp, setTimestamp] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [users, setUsers] = useState<UserResponse>();
  const router = useRouter();

  useEffect(() => {
    const generateQR = () => {
      const now = new Date();
      const formatted = now.toLocaleString();
      setTimestamp(formatted);
      const uniqueToken = Date.now();
      setQrValue(`${process.env.NEXT_PUBLIC_CHECKIN_URL}/${slug}/users/checkin/${uniqueToken}`);
    };

    generateQR();

    const interval = setInterval(generateQR, 10000);
    return () => clearInterval(interval);
  }, [router, slug]);

  useEffect(() => {
    const fetchData = async () => {
      const usersParams = new URLSearchParams();
      if (data?.id !== undefined) {
        usersParams.set("organization_id", String(data.id));
        usersParams.set("role_id", String("3"));
      }
      
      if (userData?.branch_id !== undefined) {
        usersParams.set("branch_id", String(userData?.branch_id));
      }

      try {
        const usersRes = await httpInternalApi.httpGetPublic("/users/working_today", usersParams);
        setUsers(usersRes as UserResponse);
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
      }
    };

    fetchData();
  }, [qrValue, data?.id, userData?.branch_id]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white pt-20">
      <div className="flex flex-col md:flex-row flex-grow">
        <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-gray-300 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Usuarios</h2>
          <ul className="space-y-2">
            {users?.users.map((user) => (
              <li
                key={user.id}
                className="bg-gray-100 dark:bg-gray-800 p-4 rounded shadow">
                {user.name}
              </li>
            ))}
          </ul>
        </div>

        {/* QR */}
        <div className="w-full md:w-1/2 p-6 flex flex-col">
          {/* Título alineado arriba */}
          <h2 className="text-2xl font-bold mb-4">
            Escanea para registrar tu llegada
          </h2>

          {/* Contenedor centrado solo para el QR */}
          <div className="flex flex-col items-center justify-center flex-grow">
            {qrValue && <QRCodeCanvas value={qrValue} size={256} />}

            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Código generado: {timestamp}
            </p>
          </div>
        </div>
      </div>

      {/* Botón volver: fuera del layout */}
      <div className="p-6 flex justify-center border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => router.back()}
          className="cursor-pointer px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-blue-400 transition"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default CheckinQRPage;
