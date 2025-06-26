"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import AttendanceWizard from "./AttendanceWizard";

const AttendancesPageContainer = () => {
  const { slug, data } = useOrganization();
  const { userData } = useUser();

  if (!data || !userData) return <LoadingSpinner />;

  return (
    <AttendanceWizard slug={slug || ""} organization={data} user={userData} />
  );
};

export default AttendancesPageContainer;
