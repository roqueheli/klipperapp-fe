"use client";

import AttendancesRealtime from "@/components/attendances/realtime/AttendanceRealTime";

const page = () => {
  const handleNewAttendance = (attendance: any) => {
    console.log(attendance);
  };
  return <AttendancesRealtime onNewAttendance={handleNewAttendance} />;
};

export default page;
