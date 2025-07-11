"use client";

import InputField from "@/components/form/InputField";
import SubmitButton from "@/components/form/SubmitButton";
import { useTheme } from "@/components/ThemeProvider";
import InputCard from "@/components/ui/InputCard";
import { InputFieldSimple } from "@/components/ui/InputFieldSimple";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import SummaryCard from "@/components/ui/SummaryCard";
import { useUser } from "@/contexts/UserContext";
import {
  approveTillCheck,
  getTillCheckData,
  saveTillCheck,
  updateTillCheck,
} from "@/lib/till-check/till-check.service";
import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";
import { addDays, format, isAfter, isToday, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  FormProvider,
  Resolver,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

interface TillCheckFormData {
  cash: number;
  bank: number;
  pos: number;
  notes: string;
}

interface TillCheckData {
  total_cash: number;
  total_bank: number;
  total_pos: number;
  notes?: string;
}

const tillCheckSchema = yup.object({
  cash: yup.number().required("El efectivo es requerido").min(0),
  bank: yup.number().required("Las transferencias son requeridas").min(0),
  pos: yup.number().required("El punto de venta es requerido").min(0),
  notes: yup.string().optional(),
});

export default function TillCheckPage() {
  const { userData } = useUser();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [readOnlyData, setReadOnlyData] = useState<TillCheckData | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [existingEntryId, setExistingEntryId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const methods = useForm<TillCheckFormData>({
    resolver: yupResolver(tillCheckSchema) as Resolver<TillCheckFormData>,
    defaultValues: { cash: 0, bank: 0, pos: 0, notes: "" },
  });

  const { handleSubmit, reset, watch } = methods;
  const watchedCash = watch("cash");
  const watchedBank = watch("bank");
  const watchedPos = watch("pos");
  const isTodaySelected = isToday(parseISO(selectedDate));

  const fetchData = useCallback(async () => {
    try {
      const date = new Date(selectedDate);
      const { data, form, id, status } = await getTillCheckData(date);
      setReadOnlyData(data);
      reset(form);
      setExistingEntryId(id);
      setIsReadOnly(!!id);
      setStatus(status);
    } catch {
      toast.error("Error al cargar datos");
      setReadOnlyData(null);
      reset({ cash: 0, bank: 0, pos: 0, notes: "" });
      setExistingEntryId(null);
      setIsReadOnly(false);
    }
  }, [selectedDate, reset]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onSubmit: SubmitHandler<TillCheckFormData> = async (formData) => {
    try {
      const date = new Date(selectedDate);
      if (existingEntryId) {
        await updateTillCheck(existingEntryId, formData);
        toast.success("Cierre actualizado");
      } else {
        await saveTillCheck(date, formData);
        toast.success("Cierre registrado");
      }
      setIsReadOnly(true);
      fetchData();
    } catch {
      toast.error("Error al guardar");
    }
  };

  const onApprove = async (id: string) => {
    try {
      await approveTillCheck(id);
      toast.success("Cierre aprobado exitosamente");
      fetchData(); // refrescar datos luego de aprobación
    } catch {
      toast.error("Error al aprobar el cierre");
    }
  };

  const handleDayChange = (days: number) => {
    const newDate = addDays(parseISO(selectedDate), days);
    if (days > 0 && isAfter(newDate, new Date())) return;
    setSelectedDate(format(newDate, "yyyy-MM-dd"));
  };

  const diff = (formValue: number, summaryValue: number) =>
    Number(formValue || 0) - Number(summaryValue || 0);

  const getDiffColor = (value: number) => {
    if (value === 0) return "text-green-600";
    if (value > 0) return "text-red-600";
    return "text-blue-600";
  };

  return (
    <div
      className={clsx(
        "p-6 max-w-6xl mx-auto min-h-screen transition-colors",
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      )}
    >
      <h1 className="text-3xl font-bold mb-8 text-left">📥 Cierre de caja</h1>

      <div className="flex items-center justify-center gap-4 mb-10">
        <button
          onClick={() => handleDayChange(-1)}
          className={clsx(
            "p-2 rounded-md",
            isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
          )}
        >
          <ChevronLeft />
        </button>
        <div className="w-[160px]">
          <InputFieldSimple
            label=""
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <button
          onClick={() => handleDayChange(1)}
          disabled={isTodaySelected}
          className={clsx(
            "p-2 rounded-md",
            isTodaySelected
              ? "opacity-50 cursor-not-allowed"
              : isDark
              ? "hover:bg-gray-700"
              : "hover:bg-gray-200"
          )}
        >
          <ChevronRight />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          className={clsx(
            "p-4 rounded shadow space-y-4",
            isDark ? "bg-gray-800" : "bg-gray-100"
          )}
        >
          <h2 className="text-xl font-semibold mb-6">Resumen del día</h2>
          {readOnlyData ? (
            <div className="space-y-4">
              <SummaryCard
                label="Efectivo"
                value={readOnlyData.total_cash}
                icon="💵"
                color="text-yellow-600"
              />
              <SummaryCard
                label="Transferencias"
                value={readOnlyData.total_bank}
                icon="🏦"
                color="text-blue-600"
              />
              <SummaryCard
                label="Punto de venta"
                value={readOnlyData.total_pos}
                icon="💳"
                color="text-purple-600"
              />
              <div className="mt-27">
                <SummaryCard
                  label="Total"
                  value={
                    readOnlyData.total_cash +
                    readOnlyData.total_bank +
                    readOnlyData.total_pos
                  }
                  icon="🧮"
                  color="text-green-600"
                />
              </div>
            </div>
          ) : (
            <LoadingSpinner />
          )}
        </div>

        <div
          className={clsx(
            "p-6 rounded-xl shadow transition-colors",
            isDark ? "bg-gray-800" : "bg-white"
          )}
        >
          <h2 className="text-xl font-semibold mb-4">Registrar cierre</h2>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-4">
                <InputCard label="Efectivo" icon="💵">
                  <input
                    id="cash"
                    type="number"
                    {...methods.register("cash")}
                    disabled={isReadOnly}
                    className="bg-transparent text-right w-24 outline-none font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </InputCard>
                <InputCard label="Transferencias" icon="🏦">
                  <input
                    id="bank"
                    type="number"
                    {...methods.register("bank")}
                    disabled={isReadOnly}
                    className="bg-transparent text-right w-24 outline-none font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </InputCard>
                <InputCard label="Punto de venta" icon="💳">
                  <input
                    id="pos"
                    type="number"
                    {...methods.register("pos")}
                    disabled={isReadOnly}
                    className="bg-transparent text-right w-24 outline-none font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </InputCard>
              </div>
              <InputField
                label="Notas"
                fieldName="notes"
                type="text"
                disabled={isReadOnly}
              />
              <SummaryCard
                label="Total Registrado"
                value={(
                  Number(watchedCash || 0) +
                  Number(watchedBank || 0) +
                  Number(watchedPos || 0)
                ).toLocaleString("es-CL")}
                icon="🧮"
                color="text-green-600"
              />
              <div className="flex justify-end gap-4 mt-6">
                <div className="flex justify-end gap-4 mt-6">
                  {status === "approved" ? (
                    <span
                      className={clsx(
                        "flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl shadow-sm",
                        isDark
                          ? "bg-green-100 text-green-800"
                          : "bg-green-800/30 text-green-800"
                      )}
                    >
                      ✅ Aprobado
                    </span>
                  ) : (
                    <>
                      {userData?.role?.name === "admin" &&
                        status !== "approved" && (
                          <button
                            type="button"
                            onClick={() => onApprove(existingEntryId ?? "")}
                            className={clsx(
                              "px-6 py-2 rounded font-medium transition",
                              isDark
                                ? "bg-green-700 text-white hover:bg-green-600"
                                : "bg-green-500 text-white hover:bg-green-600"
                            )}
                          >
                            Aprobar
                          </button>
                        )}
                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={() => setIsReadOnly(true)}
                          className={clsx(
                            "px-6 py-2 rounded font-medium transition",
                            isDark
                              ? "border-white bg-gray-500 text-white hover:bg-gray-700"
                              : "bg-gray-300 text-black hover:bg-gray-400"
                          )}
                        >
                          Cancelar
                        </button>
                      )}
                      {isReadOnly ? (
                        <button
                          type="button"
                          onClick={() => setIsReadOnly(false)}
                          className={clsx(
                            "px-6 py-2 rounded font-medium transition",
                            isDark
                              ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                              : "bg-yellow-500 hover:bg-yellow-600 text-white"
                          )}
                        >
                          Editar
                        </button>
                      ) : (
                        <SubmitButton
                          label="Registrar"
                          onSubmit={onSubmit}
                          styles="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium"
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>

      {readOnlyData && (
        <div
          className={clsx(
            "mt-6 p-6 rounded shadow-md",
            isDark ? "bg-gray-800" : "bg-white"
          )}
        >
          <h3 className="text-lg font-semibold mb-4">🧾 Diferencias</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="w-full flex justify-evenly items-center">
              <span className="text-gray-500">💵 Efectivo</span>
              <span
                className={clsx(
                  "font-semibold",
                  getDiffColor(diff(watchedCash, readOnlyData.total_cash))
                )}
              >
                {diff(watchedCash, readOnlyData.total_cash)}
              </span>
            </div>
            <div className="w-full flex justify-evenly items-center">
              <span className="text-gray-500">🏦 Transferencias</span>
              <span
                className={clsx(
                  "font-semibold",
                  getDiffColor(diff(watchedBank, readOnlyData.total_bank))
                )}
              >
                {diff(watchedBank, readOnlyData.total_bank)}
              </span>
            </div>
            <div className="w-full flex justify-evenly items-center">
              <span className="text-gray-500">💳 Punto de venta</span>
              <span
                className={clsx(
                  "font-semibold",
                  getDiffColor(diff(watchedPos, readOnlyData.total_pos))
                )}
              >
                {diff(watchedPos, readOnlyData.total_pos)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
