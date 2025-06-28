"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import httpInternalApi from "@/lib/common/http.internal.service";

import PhoneStep from "@/components/attendances/wizard/PhoneStep";
import SelectionStep from "@/components/attendances/wizard/SelectionStep";

import { Organization } from "@/types/organization";
import { Profile, ProfileByNumberResponse } from "@/types/profile";
import { ServiceResponse } from "@/types/service";
import { User, UserResponse } from "@/types/user";
import { getRoleByName } from "@/utils/roleUtils";

type Step = 1 | 2;

type AttendanceWizardProps = {
  slug?: string;
  organization?: Organization;
  user?: User;
  onClose?: () => void;
};

const AttendanceWizard = ({
  slug,
  organization,
  user,
  onClose,
}: AttendanceWizardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isUserListsRoute = pathname === `/${slug}/users/lists`;

  const [step, setStep] = useState<Step>(1);
  const [phone, setPhone] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const [attendanceId, setAttendanceId] = useState<number | null>(null);
  const [profile, setProfile] = useState<Profile>();
  const [users, setUsers] = useState<UserResponse>();
  const [services, setServices] = useState<ServiceResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const [hasStoredData, setHasStoredData] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFromStorageAndFetch = async () => {
      // 1. Verificar si hay datos en localStorage
      const stored =
        localStorage.getItem("attendanceInfo") ||
        localStorage.getItem("userAttendance");

      if (stored) {
        try {
          const data = JSON.parse(stored);
          setHasStoredData(data?.attendanceId);
          setAttendanceId(data?.attendanceId || null);
          setSelectedServiceId(
            data.services?.length > 0 ? data.services[0].id : null
          );
          setSelectedUserId(data?.userId || data?.id || null);
          setProfile(data?.profile || data || null);
          setPhone(data?.phoneNumber || data?.phone_number || "");
          setStep(2);
          localStorage.removeItem("attendanceInfo");
          localStorage.removeItem("userAttendance");
        } catch (e) {
          console.error("Error parsing stored attendance data", e);
        }
      }

      // 2. Cargar servicios y usuarios
      const servicesParams = new URLSearchParams();
      const usersParams = new URLSearchParams();
      const agentRole = await getRoleByName("agent");

      if (organization?.id) {
        servicesParams.set("organization_id", String(organization.id));
        usersParams.set("organization_id", String(organization.id));
        usersParams.set("role_id", String(agentRole?.id));
      }

      usersParams.set("branch_id", String(user?.branch_id ?? 1));

      try {
        setIsLoading(true);
        const [servicesRes, usersRes] = await Promise.all([
          httpInternalApi.httpGetPublic("/services", servicesParams),
          httpInternalApi.httpGetPublic("/users/working_today", usersParams),
        ]);
        setServices(servicesRes as ServiceResponse);
        setUsers(usersRes as UserResponse);
      } catch (error) {
        console.error("Error al cargar servicios y usuarios:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFromStorageAndFetch();
  }, [organization?.id, user?.branch_id]);

  const handlePhoneSubmit = async () => {
    if (!phone) return;

    try {
      const phoneParam = new URLSearchParams();
      phoneParam.set("phone_number", phone);

      const response = (await httpInternalApi.httpGetPublic(
        `/profiles`,
        phoneParam
      )) as Promise<ProfileByNumberResponse>;

      const profileResponse = await response;

      if (profileResponse.profile?.profile?.id !== undefined) {
        if (profileResponse.profile?.is_attended_today) {
          setError("Ya tienes una asistencia registrada hoy.");
          return;
        }

        setError(null);
        setProfile(profileResponse.profile?.profile);
        setStep(2);
      } else {
        localStorage.setItem("pendingPhone", phone);
        router.push(`/${slug}/profiles/register`);
      }
    } catch (error) {
      console.error("Phone validation error:", error);
    }
  };

  const handleFinish = async () => {
    if (!profile || !organization || !user) {
      toast.error("Faltan datos para crear la atención.");
      return;
    }

    const requestBody = {
      id: attendanceId || null,
      profile_id: profile.id,
      organization_id: organization?.id,
      branch_id: user?.branch_id,
      service_ids: [selectedServiceId],
      attended_by: selectedUserId !== 0 ? selectedUserId : null,
    };

    try {
      const action = hasStoredData ? "PUT" : "POST";
      const message = hasStoredData ? "actualizada" : "creada";

      await toast.promise(
        httpInternalApi.httpPostPublic("/attendances", action, requestBody),
        {
          loading: `Atención ${message}...`,
          success: `Atención ${message} exitosamente.`,
          error: `Error al ${message} la atención.`,
        }
      );

      onClose?.();
      const targetPath = `/${slug}/users/lists`;
      if (pathname !== targetPath) {
        router.push(targetPath);
      }
    } catch (error) {
      console.error("Error en la creación de atención:", error);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      {step === 1 ? (
        <PhoneStep
          phone={phone}
          isUserListsRoute={isUserListsRoute}
          onPhoneChange={setPhone}
          onSubmit={handlePhoneSubmit}
          error={error}
          onClose={isUserListsRoute ? onClose : undefined}
        />
      ) : (
        <SelectionStep
          profile={profile}
          users={users}
          services={services}
          selectedUserId={selectedUserId}
          onUserSelect={setSelectedUserId}
          selectedServiceId={selectedServiceId}
          onServiceSelect={setSelectedServiceId}
          {...(!hasStoredData
            ? { onBack: () => setStep(1) }
            : { onBack: () => router.back() })}
          onFinish={handleFinish}
        />
      )}
    </div>
  );
};

export default AttendanceWizard;
