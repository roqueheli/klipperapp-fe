"use client";

import cable from "@/lib/cable/cable";
import { AttendanceCable } from "@/types/attendance";
import { useEffect } from "react";

interface AttendancesRealtimeProps {
  onNewAttendance?: (data: AttendanceCable) => void;
}

export default function AttendancesRealtime({
  onNewAttendance,
}: AttendancesRealtimeProps) {
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

    const dessubscription = () => {
      subscription.unsubscribe();
    };

    console.log("dessubscription", dessubscription);
    
    return dessubscription;
  }, [onNewAttendance]);

  return null;
}
