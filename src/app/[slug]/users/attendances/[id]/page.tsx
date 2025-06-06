"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const mockAttendance = {
  id: 1,
  phone: "+34123456789",
  user: {
    name: "Ana López",
    image: "/user1.jpg",
    skills: ["cut", "color"],
    premium: true,
  },
  service: {
    name: "Corte de cabello",
    price: 25,
    image: "/cut.jpg",
  },
  createdAt: new Date().toISOString(),
};

const AttendanceDetailPage = () => {
  const { slug, id } = useParams();
  const router = useRouter();
  const [attendance, setAttendance] = useState<any>(null);

  useEffect(() => {
    // Aquí iría la llamada real al backend para obtener el attendance por ID
    setAttendance(mockAttendance);
  }, [id]);

  if (!attendance) {
    return <div className="p-8">Cargando detalle del turno...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-20 p-6">
      <h1 className="text-2xl font-bold mb-4">Detalle del Turno</h1>

      <div className="border rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Teléfono</h2>
        <p>{attendance.phone}</p>
      </div>

      <div className="border rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Profesional</h2>
        <div className="flex items-center gap-4">
          <img
            src={attendance.user.image}
            alt={attendance.user.name}
            className="w-20 h-20 object-cover rounded"
          />
          <div>
            <p className="font-medium">{attendance.user.name}</p>
            <div className="flex flex-wrap mt-1">
              {attendance.user.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="text-xs bg-gray-200 rounded px-2 py-1 mr-1"
                >
                  {skill}
                </span>
              ))}
            </div>
            {attendance.user.premium && (
              <p className="text-yellow-500 mt-1">★ Premium</p>
            )}
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Servicio</h2>
        <div className="flex items-center gap-4">
          <img
            src={attendance.service.image}
            alt={attendance.service.name}
            className="w-20 h-20 object-cover rounded"
          />
          <div>
            <p className="font-medium">{attendance.service.name}</p>
            <p className="text-gray-600">Precio: {attendance.service.price}€</p>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-6">
        Generado el: {new Date(attendance.createdAt).toLocaleString()}
      </div>

      <button
        onClick={() => router.push(`/${slug}/users`)}
        className="cursor-pointer bg-gray-300 px-4 py-2 rounded"
      >
        Volver
      </button>
    </div>
  );
};

export default AttendanceDetailPage;
