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
  sort?: "created_at" | "total_amount";
  dir?: "asc" | "desc";
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

  const clearSessionStorage = () => {
    sessionStorage.removeItem("attendancesData");
    sessionStorage.removeItem("attendancesPage");
    sessionStorage.removeItem("attendancesFilters");
    sessionStorage.removeItem("attendancesHasSearched");
  };

  useEffect(() => {
    const handleRouteChange = () => {
      if (!pathname?.includes("/attendances/history")) {
        resetAttendances();
      }
    };

    window.addEventListener("beforeunload", clearSessionStorage);

    return () => {
      handleRouteChange();
      window.removeEventListener("beforeunload", clearSessionStorage);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname?.includes("/attendances/history") && isInitialLoad) {
      try {
        const savedAttendances = sessionStorage.getItem("attendancesData");
        const savedFilters = sessionStorage.getItem("attendancesFilters");
        const savedHasSearched = sessionStorage.getItem(
          "attendancesHasSearched"
        );

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
        clearSessionStorage();
      }
    }
  }, [pathname, isInitialLoad]);

  const fetchAttendances = async (newFilters: AttendanceFilters) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) params.set(key, String(value));
      });

      const response = (await httpInternalApi.httpGetPublic(
        "/attendances/history",
        params
      )) as Attendances;

      setAttendances(response.attendances);
      setFilters(newFilters);
      setHasSearched(true);

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
    clearSessionStorage();
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

