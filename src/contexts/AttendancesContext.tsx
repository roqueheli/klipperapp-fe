// contexts/AttendancesContext.tsx
"use client";

import httpInternalApi from "@/lib/common/http.internal.service";
import { Attendance, Attendances } from "@/types/attendance";
import { usePathname, useSearchParams } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AttendancesContextType {
  attendances: Attendance[];
  fetchAttendances: (filters: AttendanceFilters) => Promise<void>;
  isLoading: boolean;
  filters: AttendanceFilters;
  setFilters: (filters: AttendanceFilters) => void;
  resetAttendances: () => void;
  hasSearched: boolean;
}

export interface AttendanceFilters {
  year?: string;
  month?: string;
  day?: string;
  branch_id?: string;
  attended_by?: string;
  status?: string;
  order_by?: "date" | "total_amount";
  order_dir?: "asc" | "desc";
}

const AttendancesContext = createContext<AttendancesContextType | undefined>(
  undefined
);

export const AttendancesProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<AttendanceFilters>({});
  const [hasSearched, setHasSearched] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Track if we're on the attendances page
  const isAttendancesPage = pathname?.includes("/attendances/history");

  // Limpiar datos cuando se sale de la página
  useEffect(() => {
    const handleRouteChange = () => {
      if (!isAttendancesPage) {
        resetAttendances();
      }
    };

    // Limpiar en el evento beforeunload (cuando se cierra la pestaña/ventana)
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("attendancesData");
      sessionStorage.removeItem("attendancesFilters");
      sessionStorage.removeItem("attendancesHasSearched");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      handleRouteChange();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isAttendancesPage]);

  // Cargar datos iniciales del sessionStorage solo si estamos en la página de attendances
  useEffect(() => {
    if (isAttendancesPage && isInitialLoad) {
      try {
        const savedAttendances = sessionStorage.getItem("attendancesData");
        const savedFilters = sessionStorage.getItem("attendancesFilters");
        const savedHasSearched = sessionStorage.getItem(
          "attendancesHasSearched"
        );

        // Manejo seguro de los datos del sessionStorage
        if (
          savedAttendances &&
          savedAttendances !== "undefined" &&
          savedAttendances !== "null"
        ) {
          setAttendances(JSON.parse(savedAttendances));
        }

        if (
          savedFilters &&
          savedFilters !== "undefined" &&
          savedFilters !== "null"
        ) {
          setFilters(JSON.parse(savedFilters));
        }

        if (savedHasSearched) {
          setHasSearched(savedHasSearched === "true");
        }

        setIsInitialLoad(false);
      } catch (error) {
        console.error("Error parsing sessionStorage data:", error);
        // Limpiar datos corruptos
        sessionStorage.removeItem("attendancesData");
        sessionStorage.removeItem("attendancesFilters");
        sessionStorage.removeItem("attendancesHasSearched");
      }
    }
  }, [isAttendancesPage, isInitialLoad]);

  const fetchAttendances = async (newFilters: AttendanceFilters) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) params.set(key, String(value));
      });

      const response = (await httpInternalApi.httpGetPublic(
        "/attendances",
        params
      )) as Attendances;

      setAttendances(response.attendances);
      setFilters(newFilters);
      setHasSearched(true);

      // Persistir en sessionStorage
      sessionStorage.setItem(
        "attendancesData",
        JSON.stringify(response.attendances)
      );
      sessionStorage.setItem("attendancesFilters", JSON.stringify(newFilters));
      sessionStorage.setItem("attendancesHasSearched", "true");
    } catch (error) {
      console.error("Error fetching attendances:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetAttendances = () => {
    setAttendances([]);
    setFilters({});
    setHasSearched(false);
    sessionStorage.removeItem("attendancesData");
    sessionStorage.removeItem("attendancesFilters");
    sessionStorage.removeItem("attendancesHasSearched");
  };

  return (
    <AttendancesContext.Provider
      value={{
        attendances,
        fetchAttendances,
        isLoading,
        filters,
        setFilters,
        resetAttendances,
        hasSearched,
      }}
    >
      {children}
    </AttendancesContext.Provider>
  );
};

export const useAttendances = () => {
  const context = useContext(AttendancesContext);
  if (!context) {
    throw new Error(
      "useAttendances must be used within an AttendancesProvider"
    );
  }
  return context;
};
