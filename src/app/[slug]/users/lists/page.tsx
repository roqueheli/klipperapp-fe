"use client";

import { useIsWorkingTodayEmpty } from "@/hooks/useIsWorkingTodayEmpty";
import AttendanceListsPageContainer from "./AttendanceListsPageContainer";

export default function AttendanceListsPage() {
  const isWorkingTodayEmpty = useIsWorkingTodayEmpty();

  return (
    <AttendanceListsPageContainer isWorkingTodayEmpty={isWorkingTodayEmpty} />
  );
}
