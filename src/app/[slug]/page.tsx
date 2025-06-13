"use client";

import { useOrganization } from "@/contexts/OrganizationContext";
import { isValidOrganization } from "@/utils/organization.utils";
import { redirect } from "next/navigation";

const OrganizationPage = () => {
  const { slug, data } = useOrganization();

  if (!isValidOrganization(data)) {
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

  return redirect(`/${slug}/users`);
};

export default OrganizationPage;
