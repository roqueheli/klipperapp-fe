"use client";

import { useOrganization } from "@/contexts/OrganizationContext";
import AttendanceWizard from "./AttendanceWizard";
import { useUser } from "@/contexts/UserContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const AttendancesPageContainer = () => {
  const { slug, data } = useOrganization();
  const { userData } = useUser();

  if (!data || !userData) return <LoadingSpinner />;
  
  return <AttendanceWizard slug={slug || ""} organization={data} user={userData} />;
};

export default AttendancesPageContainer;
