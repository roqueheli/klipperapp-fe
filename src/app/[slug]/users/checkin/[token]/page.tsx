"use client";

import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

const AutoCheckinPage = ({ params }: { params: { token: string } }) => {
  const { slug, data } = useOrganization();
  const { userData } = useUser();
  const router = useRouter();

  useEffect(() => {
    const postCheckin = async () => {
      const tokenTimestamp = Number(params.token);

      if (isNaN(tokenTimestamp)) {
        toast.error("Código QR inválido.");
        router.push(`/${slug}/users/checkin`);
        return;
      }

      const start_working_date = new Date(tokenTimestamp).toISOString();

      const requestBody = {
        organization_id: data?.id,
        branch_id: userData?.branch_id,
        user_id: userData?.id,
        start_working_at: start_working_date,
      };

      try {
        await toast.promise(
          httpInternalApi.httpPostPublic("/checkin", "POST", requestBody),
          {
            loading: "Procesando check-in...",
            success: "Check-in exitoso.",
            error: "Ocurrió un error al realizar el check-in.",
          }
        );

        router.push(`/${slug}/users/checkin`);
      } catch (error) {
        router.push(`/${slug}/users/checkin`);
      }
    };

    postCheckin();
  }, [router, slug, data, userData, params.token]);

  return (
    <div className="h-screen flex justify-center items-center text-xl">
      Procesando check-in...
    </div>
  );
};

export default AutoCheckinPage;
