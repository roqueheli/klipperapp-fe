"use client";

import { useRouter } from "next/navigation";

interface Props {
  amountPaid: number;
  finalTotal: number;
  servicesCount: number;
  unifiedAttendances: { services?: { id: number }[] }[];
  onExecute: () => void;
}

const TransactionActionButtons = ({
  amountPaid,
  finalTotal,
  servicesCount,
  unifiedAttendances,
  onExecute,
}: Props) => {
  const router = useRouter();

  const hasEmptyAttendance = unifiedAttendances.some(
    (a) => !a.services || a.services.length === 0
  );

  const isDisabled =
    amountPaid < finalTotal ||
    amountPaid <= 0 ||
    servicesCount === 0 ||
    hasEmptyAttendance;

  const disabledReason =
    amountPaid <= 0
      ? "El monto pagado debe ser mayor que cero."
      : amountPaid < finalTotal
      ? "El monto pagado no puede ser menor al total."
      : servicesCount === 0
      ? "Debes agregar al menos un servicio."
      : hasEmptyAttendance
      ? "Hay asistencias unificadas sin servicios."
      : "";

  return (
    <div className="flex justify-between mt-6">
      <button
        onClick={() => router.back()}
        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded"
      >
        Volver
      </button>

      <div title={isDisabled ? disabledReason : ""}>
        <button
          onClick={onExecute}
          disabled={isDisabled}
          className={`px-4 py-2 rounded font-semibold ${
            isDisabled
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Ejecutar transacción
        </button>
      </div>
    </div>
  );
};

export default TransactionActionButtons;
