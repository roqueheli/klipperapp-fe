"use client";

import { useOrganization } from "@/contexts/OrganizationContext";
import { Organization } from "@/types/organization";
import { redirect } from "next/navigation";

const isValidOrganization = (data: any): data is Organization => {
  return data && !data.error && typeof data.name === "string";
};

const OrganizationPage = () => {
  const { organization } = useOrganization();

  if (!isValidOrganization(organization)) {
    return (
      <main className="h-100 grid justify-center content-center border border-white border-dashed">
        <h1 className="text-center text-2xl font-bold text-red-600">
          ¡Organization not found!
        </h1>
        <p className="text-center text-gray-600">
          Check the URL or contact support.
        </p>
      </main>
    );
  }

  return null;
};

export default OrganizationPage;
