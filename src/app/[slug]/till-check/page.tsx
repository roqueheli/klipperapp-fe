"use client";

import { useOrganization } from "@/contexts/OrganizationContext";
import { useEffect, useState } from "react";

const TillCheckPage = () => {
  const { data: organization } = useOrganization();
  const [banks_accounts, setBanksAccounts] = useState<
    Array<{ bank_name: string; bank_account_number: string }>
  >([]);

  useEffect(() => {
    setBanksAccounts(
      organization?.metadata?.banks_accounts?.map((bank) => ({
        bank_name: bank.bank_name,
        bank_account_number: bank.alias,
      })) || []
    );
  }, [organization]);

  return (
    <div className="flex flex-col items-center min-h-screen p-6 mx-auto">
      <h1 className="w-full text-left text-2xl font-bold mb-4">
        🏧 Cuadre de caja
      </h1>
      {banks_accounts.length > 0
        ? banks_accounts[0].bank_name
        : "Bank name not available"}
    </div>
  );
};

export default TillCheckPage;
