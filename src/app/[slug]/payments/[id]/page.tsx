"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Attendance, Attendances } from "@/types/attendance";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const PaymentsPage = () => {
  const { id } = useParams();
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [discount, setDiscount] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [paymentType, setPaymentType] = useState("Efectivo");
  const [transactionNumber, setTransactionNumber] = useState("");

  useEffect(() => {
    const attendanceParams = new URLSearchParams();
    attendanceParams.set("id", String(id));

    const fetchAttendance = async () => {
      try {
        const response = (await httpInternalApi.httpGetPublic(
          `/attendances`,
          attendanceParams
        )) as Attendances;
        setAttendance(response?.attendances[0]);
      } catch (error) {
        console.error("Error al cargar asistencia:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendance();
  }, [id]);

  if (isLoading || !attendance) return <LoadingSpinner />;

  if (!attendance)
    return <div className="text-center mt-20">No se encontró información.</div>;

  const total = Number(attendance?.service?.price ?? 0);
  const finalTotal = total - discount;

  const handleExecuteTransaction = () => {
    alert("Transacción ejecutada correctamente");
    // Aquí podrías hacer un POST con los datos de transacción
  };

  return (
    <div className="mt-20 mb-10 w-full mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-6">
          Detalle de la transacción
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h5 className="text-lg font-medium mb-2">Cliente:</h5>
            <p>
              <strong>Nombre:</strong> {attendance.profile.name}
            </p>
            <p>
              <strong>Email:</strong> {attendance.profile.email}
            </p>
            <p>
              <strong>Teléfono:</strong> {attendance.profile.phone_number}
            </p>
          </div>
          <div>
            <h5 className="text-lg font-medium mb-2">Atendido por:</h5>
            <p>
              <strong>Nombre:</strong> {attendance.attended_by_user.name}
            </p>
            <p>
              <strong>Email:</strong> {attendance.attended_by_user.email}
            </p>
            <p>
              <strong>Teléfono:</strong>{" "}
              {attendance.attended_by_user.phone_number}
            </p>
          </div>
        </div>

        <hr className="border-gray-300 dark:border-gray-600 mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="font-semibold block mb-1">Servicio</label>
            <input
              type="text"
              readOnly
              className="w-full bg-gray-100 dark:bg-gray-700 rounded px-3 py-2"
              value={attendance.service.name}
            />
          </div>
          <div>
            <label className="font-semibold block mb-1">Monto Total</label>
            <input
              type="text"
              readOnly
              className="w-full bg-gray-100 dark:bg-gray-700 rounded px-3 py-2"
              value={`$${total.toLocaleString()}`}
            />
          </div>
          <div>
            <label className="font-semibold block mb-1">Fecha</label>
            <input
              type="text"
              readOnly
              className="w-full bg-gray-100 dark:bg-gray-700 rounded px-3 py-2"
              value={new Date(attendance.created_at).toLocaleString()}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="font-semibold block mb-1">Descuento</label>
            <input
              type="number"
              min={0}
              max={total}
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="font-semibold block mb-1">Total Final</label>
            <input
              type="text"
              readOnly
              className="w-full bg-gray-100 dark:bg-gray-700 rounded px-3 py-2"
              value={`$${finalTotal.toLocaleString()}`}
            />
          </div>
          <div>
            <label className="font-semibold block mb-1">Monto Pagado</label>
            <input
              type="number"
              min={0}
              value={amountPaid}
              onChange={(e) => setAmountPaid(Number(e.target.value))}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="font-semibold block mb-1">Tipo de Pago</label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2"
            >
              <option>Efectivo</option>
              <option>Transferencia</option>
              <option>Punto de venta</option>
            </select>
          </div>
          <div>
            <label className="font-semibold block mb-1">
              Número de Transacción
            </label>
            <input
              type="text"
              placeholder="Ej: 123456789"
              value={transactionNumber}
              onChange={(e) => setTransactionNumber(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded"
          >
            Volver
          </button>
          <button
            onClick={handleExecuteTransaction}
            disabled={amountPaid < finalTotal}
            className={`px-4 py-2 rounded font-semibold ${
              amountPaid < finalTotal
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Ejecutar transacción
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
