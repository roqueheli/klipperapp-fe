"use client";

import { Attendance } from "@/types/attendance";
import { Expenses } from "@/types/expenses";
import { Payment } from "@/types/payments";
import { User } from "@/types/user";
import { translateStatus } from "@/utils/organization.utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  FileDown,
  Send,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import ExpensesDetailsSection from "./ExpensesDetailsSection";
import PaymentDetailsSection from "./PaymentDetailsSection";
import { on } from "events";

interface PaymentCardProps {
  user: User;
  finishedAttendances: Attendance[];
  otherAttendances: Attendance[];
  expenses: Expenses[];
  payments: Payment[];
  earnings: number;
  expensesTotal: number;
  amountToPay: number;
  period?: { from?: string; to?: string };
  onSend?: (data: {
    payment_id?: number;
    organization_id: number;
    branch_id: number;
    user_id: number;
    from?: string;
    to?: string;
    amount: number;
  }) => void;
  onApprove?: (data: { id: number }) => void;
  onReject?: (data: { id: number }) => void;
  canView?: boolean;
}

export default function PaymentCard({
  user,
  finishedAttendances,
  otherAttendances,
  expenses,
  payments,
  earnings,
  expensesTotal,
  amountToPay,
  period,
  canView,
  onSend,
  onApprove,
  onReject
}: PaymentCardProps) {
  const [open, setOpen] = useState(false);

  const exportToPDF = () => {
    const doc = new jsPDF();
    const fullName = user.name;
    const fileName = `Resumen-${fullName.replace(/\s+/g, "_")}.pdf`;

    doc.setFontSize(16);
    doc.text(`Resumen de Pagos - ${fullName}`, 14, 20);

    if (period?.from && period?.to) {
      doc.setFontSize(12);
      doc.text(`Periodo: ${period.from} - ${period.to}`, 14, 28);
    }

    if (finishedAttendances.length > 0) {
      autoTable(doc, {
        startY: 35,
        head: [["ID", "Monto Total", "Método de Pago"]],
        body: finishedAttendances.map((att) => [
          att.id,
          `$${att.total_amount?.toLocaleString("es-CL") ?? "-"}`,
          att.payment_method ?? "-",
        ]),
        styles: { fontSize: 10 },
        theme: "striped",
        headStyles: { fillColor: [61, 217, 235] },
      });
    } else {
      doc.text("Sin turnos finalizados.", 14, 35);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const offsetY = (doc as any).lastAutoTable?.finalY || 40;
    if (otherAttendances.length > 0) {
      autoTable(doc, {
        startY: offsetY + 10,
        head: [["ID", "Estado"]],
        body: otherAttendances.map((att) => [att.id, att.status]),
        styles: { fontSize: 10 },
        theme: "striped",
      });
    } else {
      doc.text("Sin otros turnos.", 14, offsetY + 10);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalY = (doc as any).lastAutoTable?.finalY || offsetY + 20;
    doc.setFontSize(12);
    doc.text("Resumen:", 14, finalY + 10);
    doc.setFontSize(10);
    doc.text(
      `Ganancias: $${earnings.toLocaleString("es-CL")}`,
      14,
      finalY + 16
    );
    doc.text(
      `Gastos: $${parseInt(expensesTotal.toString()).toLocaleString("es-CL")}`,
      14,
      finalY + 22
    );
    doc.text(
      `Total a pagar: $${parseInt(amountToPay.toString()).toLocaleString(
        "es-CL"
      )}`,
      14,
      finalY + 28
    );

    doc.save(fileName);
  };

  const handleSend = () => {
    if (onSend) {
      onSend({
        payment_id: payments[0]?.id ?? undefined,
        organization_id: user.organization_id ?? 0,
        branch_id: user.branch_id ?? 0,
        user_id: user.id,
        from: period?.from,
        to: period?.to,
        amount: amountToPay,
      });
    }
  };

  return (
    <div className="border-gray-300 rounded-2xl shadow-md bg-white dark:bg-slate-800 p-6 mb-6 transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">
            {user.name}
          </h3>
          <p className="text-sm text-gray-500">{user.email}</p>
          {period?.from && period?.to && (
            <p className="text-xs text-gray-400">
              Periodo: {period.from} - {period.to}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Estado del pago visible solo si corresponde */}
          {(() => {
            const state = payments?.[0]?.aasm_state;

            // Mostrar estado: si es admin, siempre. Si no es admin, solo si está aprobado.
            if (state && (canView || state === "approved")) {
              return (
                <span
                  className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl shadow-sm ${
                    state === "pending"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-200"
                      : state === "approved"
                      ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-200"
                      : state === "rejected"
                      ? "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-200"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {translateStatus(state)}
                </span>
              );
            }

            return null;
          })()}

          {/* Botón Enviar solo si es admin y no existe estado o está rechazado */}
          {canView &&
            (!payments?.[0]?.aasm_state ||
              payments[0].aasm_state === "rejected") && (
              <button
                onClick={handleSend}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-sky-500 hover:shadow-lg transition duration-200 shadow-md text-sm font-medium"
              >
                <Send size={16} />
                {payments?.[0]?.aasm_state === "rejected" ? "Reenviar" : "Enviar"}
              </button>
            )}

          {!canView &&
            (!payments?.[0]?.aasm_state ||
              payments[0].aasm_state === "pending") && (
              <>
                <button
                  onClick={() => payments[0]?.id ? onApprove?.({ id: payments[0].id }) : undefined}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-sky-500 hover:shadow-lg transition duration-200 shadow-md text-sm font-medium"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 animate-pulse" />
                  Aprobar
                </button>
                <button
                  onClick={() => payments[0]?.id ? onReject?.({ id: payments[0].id }) : undefined}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-500 hover:shadow-lg transition-all duration-200 shadow-md text-sm font-medium"
                >
                  <XCircle className="w-5 h-5 text-red-100" />
                  Rechazar
                </button>
              </>
            )}

          {/* Exportar */}
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200 hover:shadow-lg transition duration-200 shadow-md text-sm font-medium dark:bg-green-800 dark:text-white dark:hover:bg-green-600"
          >
            <FileDown size={16} />
            Exportar
          </button>

          {/* Toggle Details */}
          <button
            onClick={() => setOpen(!open)}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition"
            aria-label="Toggle Details"
          >
            {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Details */}
      {open && (
        <div className="mt-4 text-sm text-gray-700 dark:text-gray-100 space-y-4">
          <PaymentDetailsSection
            title="Turnos Finalizados"
            attendances={finishedAttendances}
            renderItem={(att) => (
              <li
                key={att.id}
                className="w-full list-none bg-gradient-to-r from-green-100/60 to-green-50 dark:from-green-800/30 dark:to-green-900/10 border border-green-300 dark:border-green-700 rounded-2xl p-4 mb-3 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-800 dark:text-gray-100">
                  <div>
                    <span className="font-semibold text-green-700 dark:text-green-300">
                      ID Atención:
                    </span>{" "}
                    <span>{att.id}</span>
                  </div>

                  <div>
                    <span className="font-semibold text-green-700 dark:text-green-300">
                      Monto:
                    </span>{" "}
                    <span>${att.user_amount?.toLocaleString("es-CL")}</span>
                  </div>

                  <div>
                    <span className="font-semibold text-green-700 dark:text-green-300">
                      Método de Pago:
                    </span>{" "}
                    <span>{att.payment_method || "-"}</span>
                  </div>

                  <div>
                    <span className="font-semibold text-green-700 dark:text-green-300">
                      Fecha:
                    </span>{" "}
                    <span>
                      {att.end_attendance_at
                        ? new Date(att.end_attendance_at).toLocaleString(
                            "es-CL"
                          )
                        : "-"}
                    </span>
                  </div>
                </div>
              </li>
            )}
            emptyText="Sin turnos finalizados."
          />

          <PaymentDetailsSection
            title="Otros Turnos"
            attendances={otherAttendances}
            renderItem={(att) => (
              <li
                key={att.id}
                className="w-full list-none bg-gradient-to-r from-yellow-100/60 to-yellow-50 dark:from-yellow-800/30 dark:to-yellow-900/10 border border-yellow-300 dark:border-yellow-700 rounded-2xl p-4 mb-3 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-800 dark:text-gray-100">
                  <div>
                    <span className="font-semibold text-yellow-700 dark:text-yellow-300">
                      Id Atención:
                    </span>{" "}
                    <span>{att.id}</span>
                  </div>

                  <div>
                    <span className="font-semibold text-yellow-700 dark:text-yellow-300">
                      Estado:
                    </span>{" "}
                    <span>{att.status}</span>
                  </div>
                </div>
              </li>
            )}
            emptyText="Sin otros turnos."
          />

          {expenses && (
            <ExpensesDetailsSection
              title="Gastos"
              expenses={expenses}
              renderItem={(expense) => (
                <li
                  key={expense.id}
                  className="w-full list-none bg-gradient-to-r from-red-100/60 to-red-50 dark:from-red-800/30 dark:to-red-900/10 border border-red-300 dark:border-red-700 rounded-2xl p-4 mb-3 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-800 dark:text-gray-100">
                    <div>
                      <span className="font-semibold text-red-700 dark:text-red-300">
                        ID Gasto:
                      </span>{" "}
                      <span>{expense.id}</span>
                    </div>

                    <div>
                      <span className="font-semibold text-red-700 dark:text-red-300">
                        Monto:
                      </span>{" "}
                      <span>
                        ${Math.trunc(expense.amount).toLocaleString("es-CL")}
                      </span>
                    </div>

                    <div>
                      <span className="font-semibold text-red-700 dark:text-red-300">
                        Descripción:
                      </span>{" "}
                      <span>{expense.description}</span>
                    </div>

                    <div>
                      <span className="font-semibold text-red-700 dark:text-red-300">
                        Fecha:
                      </span>{" "}
                      <span>
                        {new Date(expense.created_at).toLocaleString("es-CL")}
                      </span>
                    </div>

                    <div>
                      <span className="font-semibold text-red-700 dark:text-red-300">
                        Cantidad:
                      </span>{" "}
                      <span>{expense.quantity}</span>
                    </div>
                  </div>
                </li>
              )}
              emptyText="Sin gastos registrados."
            />
          )}

          <div className="mt-6 p-4 rounded-2xl shadow-md bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-100 mb-3">
              💰 Resumen financiero
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[15px] font-medium">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl px-4 py-2 text-green-700 dark:text-green-400 shadow-inner">
                <span className="block text-xs uppercase tracking-wide">
                  Ganancias
                </span>
                <span className="text-base font-semibold">
                  ${earnings.toLocaleString("es-CL")}
                </span>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-2 text-red-600 dark:text-red-400 shadow-inner">
                <span className="block text-xs uppercase tracking-wide">
                  Gastos
                </span>
                <span className="text-base font-semibold">
                  ${parseInt(expensesTotal.toString()).toLocaleString("es-CL")}
                </span>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl px-4 py-2 text-blue-700 dark:text-blue-400 shadow-inner">
                <span className="text-white block text-xs uppercase tracking-wide">
                  Total a pagar
                </span>
                <span className="text-base font-semibold">
                  ${parseInt(amountToPay.toString()).toLocaleString("es-CL")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
