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

/**
 * Componente que renderiza el asistente para crear una atención.
 *
 * Este componente utiliza el hook `usePathname` para determinar si se encuentra en la ruta de "usuarios" o no.
 * Si no se encuentra en la ruta de "usuarios", se renderiza el componente `PhoneStep` para que el usuario pueda
 * ingresar su número de teléfono. Si se encuentra en la ruta de "usuarios", se renderiza directamente el componente
 * `SelectionStep` con los usuarios y servicios disponibles.
 *
 * El componente utiliza el hook `useState` para almacenar el estado de la atención:
 * - `step`: El paso actual del asistente (1 o 2).
 * - `phone`: El número de teléfono ingresado por el usuario.
 * - `selectedUserId`: El ID del usuario seleccionado.
 * - `selectedServiceId`: El ID del servicio seleccionado.
 * - `attendanceId`: El ID de la atención a crear o actualizar.
 * - `profile`: El perfil del usuario que se va a crear la atención.
 * - `users`: Los usuarios disponibles para asignar la atención.
 * - `services`: Los servicios disponibles para asignar la atención.
 * - `isLoading`: Un booleano que indica si se está cargando la información de los usuarios y servicios.
 * - `hasStoredData`: Un booleano que indica si se tiene información almacenada en el localStorage.
 * - `error`: Un string que indica el error que se produce al intentar crear la atención.
 *
 * El componente utiliza el hook `useEffect` para cargar la información de los usuarios y servicios cuando se monta
 * el componente. También se utiliza para recuperar la información almacenada en el localStorage y para limpiar el
 * localStorage cuando se completa el asistente.
 *
 * El componente utiliza el hook `useCallback` para crear una función que se encarga de crear o actualizar la atención.
 * La función se utiliza en el componente `SelectionStep` para crear o actualizar la atención cuando el usuario hace
 * clic en el botón "Finalizar".
 */
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
    const fetchData = async () => {
      const servicesParams = new URLSearchParams();
      const usersParams = new URLSearchParams();
      const agentRole = await getRoleByName("agent");

      if (organization?.id) {
        servicesParams.set("organization_id", String(organization?.id));
        usersParams.set("organization_id", String(organization?.id));
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

    fetchData();
  }, [organization?.id, user?.branch_id]);

  useEffect(() => {
    const stored = localStorage.getItem("attendanceInfo");

    if (stored) {
      try {
        const data = JSON.parse(stored);
        setHasStoredData(true);
        setAttendanceId(data.attendanceId || null);
        setSelectedServiceId(data.services.length > 0 ? data.services[0].id : null);
        setSelectedUserId(data.userId || null);
        setProfile(data.profile);
        setPhone(data.phoneNumber || "");
        setStep(2);

        // Limpiar el localStorage si ya no lo necesitas
        localStorage.removeItem("attendanceInfo");
      } catch (e) {
        console.error("Error parsing stored attendance data", e);
      }
    }
  }, []);
  
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
      organization_id: organization.id,
      branch_id: user.branch_id,
      service_ids: [selectedServiceId],
      attended_by: selectedUserId !== 0 ? selectedUserId : null,
    };

    try {
      const action = hasStoredData ? "PUT" : "POST";
      const message = hasStoredData ? "actualizada" : "creada";
      
      await toast.promise(
        httpInternalApi.httpPostPublic(
          "/attendances",
          action,
          requestBody
        ),
        {
          loading: `Atención ${message}...`,
          success: `Atención ${message} exitosamente.`,
          error: `Error al ${message} la atención.`,
        }
      );

      onClose?.();
      router.back();
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
          {...(!hasStoredData ? { onBack: () => setStep(1) } : { onBack: () => router.back() })}
          onFinish={handleFinish}
        />
      )}
    </div>
  );
};

export default AttendanceWizard;
