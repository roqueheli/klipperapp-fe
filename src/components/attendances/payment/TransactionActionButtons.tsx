"use client";

import { useRouter } from "next/navigation";

interface Props {
  amountPaid: number;
  finalTotal: number;
  servicesCount: number;
  unifiedAttendances: { services?: { id: number }[] }[];
  onExecute: () => void;
  isSubmitting: boolean;
}

const TransactionActionButtons = ({
  amountPaid,
  finalTotal,
  servicesCount,
  unifiedAttendances,
  onExecute,
  isSubmitting,
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
      ? "El monto a pagar debe ser mayor que cero."
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
          disabled={isDisabled || isSubmitting}
          className={`px-4 py-2 rounded font-semibold ${
            (isDisabled || isSubmitting)
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          }`}
        >
          {isSubmitting ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8h-4l3 3 3-3h-4a8 8 0 01-8 8z"
              ></path>
            </svg>
          ) : (
            "Ejecutar transacción"
          )}
        </button>
      </div>
    </div>
  );
};

export default TransactionActionButtons;
