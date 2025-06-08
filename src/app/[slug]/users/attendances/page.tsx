"use client";

import { useOrganization } from "@/contexts/OrganizationContext";
import AttendanceWizard from "./AttendanceWizard";
import { useUser } from "@/contexts/UserContext";

const AttendancesPageContainer = () => {
  const { slug, data } = useOrganization();
  const { userData } = useUser();

  if (!data || !userData) return <div>Cargando datos...</div>;
  
  return <AttendanceWizard slug={slug || ""} organization={data} user={userData} />;
};

export default AttendancesPageContainer;
