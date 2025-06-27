import cable from "@/lib/cable/cable";
import { Attendance } from "@/types/attendance";
import { useEffect } from "react";

interface AttendancesRealtimeProps {
  onNewAttendance?: (data: Attendance) => void;
}

export default function AttendancesRealtime({ onNewAttendance }: AttendancesRealtimeProps) {
  useEffect(() => {
    const subscription = cable.subscriptions.create(
      { channel: "AttendancesChannel" },
      {
        received(data) {
          // Aquí recibes el evento desde Rails
          if (onNewAttendance) onNewAttendance(data);
        },
      }
    );

    return () => {
      (subscription as any).unsubscribe();
    };
  }, [onNewAttendance]);

  return null; // Este componente solo escucha, no renderiza nada
}
