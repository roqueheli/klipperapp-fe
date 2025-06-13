"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import httpInternalApi from "@/lib/common/http.internal.service";
import { CreateAttendanceResponse } from "@/types/attendance";
import { Organization } from "@/types/organization";
import {
  Profile,
  ProfileByNumberResponse
} from "@/types/profile";
import { ServiceResponse } from "@/types/service";
import { User, UserResponse } from "@/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Step = 1 | 2 | 3;

type AttendanceWizardProps = {
  slug: string;
  organization: Organization;
  user: User;
};

const AttendanceWizard = ({
  slug,
  organization,
  user,
}: AttendanceWizardProps) => {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [phone, setPhone] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const [profile, setProfile] = useState<Profile>();
  const [users, setUsers] = useState<UserResponse>();
  const [services, setServices] = useState<ServiceResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleFinish = async () => {
    if (!profile || !selectedServiceId || !organization || !user) {
      toast.error("Some data are missing to create the attendance.");
      return;
    }

    const requestBody = {
      profile_id: profile?.id,
      organization_id: organization.id,
      branch_id: user?.branch_id,
      service_id: selectedServiceId,
      attended_by: selectedUserId !== 0 ? selectedUserId : null,
    };

    try {
      const response: CreateAttendanceResponse = await toast.promise(
        httpInternalApi.httpPostPublic("/attendances", "POST", requestBody),
        {
          loading: "Creating attendance...",
          success: "Attendance successfully created.",
          error: "An error occurred while creating the attendance.",
        }
      );

      router.push(`/${slug}/users/attendances/${response?.profile.id}`);

      setTimeout(() => {
        router.push(`/${slug}/users/lists`);
      }, 8000);
    } catch (error) {
      console.error("Error in the creation of assistance:", error);
    }
  };

  const handlePhoneSubmit = async () => {
    if (!phone) return;

    try {
      const phoneParam = new URLSearchParams();
      phoneParam.set("phone_number", phone);

      //necesito el endpoint me diga si ya el cliente tiene una attendance al menos en pending.
      const response = (await httpInternalApi.httpGetPublic(
        `/profiles`,
        phoneParam
      )) as Promise<ProfileByNumberResponse>;

      if ((await response).profile?.profile?.id !== undefined) {
        if ((await response).profile?.is_attended_today) {
          setError("Ya tienes una asistencia registrada hoy.");
          return;
        }

        setError(null);
        setProfile((await response).profile?.profile);
        setStep(2);
      } else {
        localStorage.setItem("pendingPhone", phone);
        router.push(`/${slug}/profiles/register`);
      }
    } catch (error) {
      console.error("Phone validation error:", error);
    }
  };

  useEffect(() => {
    const storedProfile = localStorage.getItem("userAttendance");
    if (storedProfile) {
      const parsed: Profile = JSON.parse(storedProfile);

      if (
        parsed?.id &&
        parsed?.name &&
        parsed?.email &&
        parsed?.phone_number &&
        parsed?.organization_id
      ) {
        localStorage.removeItem("userAttendance");
        setProfile(parsed);
        setStep(2);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const servicesParams = new URLSearchParams();
      if (organization?.id !== undefined) {
        servicesParams.set("organization_id", String(organization.id));
      }

      const usersParams = new URLSearchParams();
      if (organization?.id !== undefined) {
        usersParams.set("organization_id", String(organization.id));
        usersParams.set("role_id", String("3"));
      }

      if (user?.branch_id !== undefined) {
        usersParams.set("branch_id", String(user.branch_id));
      } else {
        usersParams.set("branch_id", String("1"));
      }

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
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      {/* Step 1 */}
      {step === 1 && (
        <div className="text-center">
          <h2 className="text-3xl font-extrabold mb-6 text-blue-600 dark:text-blue-400 drop-shadow-sm">
            Ingresa tu número de teléfono
          </h2>
          <input
            type="tel"
            className="border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-md w-full max-w-sm mx-auto text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition"
            placeholder="Ej: 9 1234 5678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <div className="mt-8 flex justify-center gap-6 max-w-sm mx-auto">
            <button
              onClick={() => router.back()}
              className="flex-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-semibold px-6 py-3 rounded-md shadow-sm transition"
              aria-label="Volver"
            >
              Volver
            </button>
            <button
              disabled={!phone}
              onClick={handlePhoneSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-md shadow-sm transition"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-4 text-center text-red-600 dark:text-red-400 font-semibold">
          {error}
        </p>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div>
          {profile?.name && (
            <p className="text-left mb-4 text-xl font-semibold text-blue-700 dark:text-blue-400">
              Hola, {profile?.name}
            </p>
          )}
          <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-600 dark:text-blue-400 drop-shadow-sm">
            Selecciona un profesional
          </h2>

          {isLoading ? (
            <p className="text-center text-gray-600 dark:text-gray-400">
              Cargando usuarios...
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {users?.users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`cursor-pointer border rounded-lg p-5 flex flex-col items-center gap-3 shadow-sm transition 
                    ${
                      selectedUserId === user.id
                        ? "border-blue-600 shadow-blue-300 dark:shadow-blue-700"
                        : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                  tabIndex={0}
                  role="button"
                  aria-pressed={selectedUserId === user.id}
                >
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover shadow"
                  />
                  <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {user.name}
                  </div>
                  {user.premium && (
                    <div className="text-yellow-400 font-semibold">
                      ⭐ Premium
                    </div>
                  )}
                </div>
              ))}
              <div
                onClick={() => setSelectedUserId(0)}
                className={`cursor-pointer border rounded-lg p-5 flex items-center justify-center shadow-sm transition text-lg font-semibold
                  ${
                    selectedUserId === 0
                      ? "border-blue-600 shadow-blue-300 dark:shadow-blue-700"
                      : "border-blue-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                tabIndex={0}
                role="button"
                aria-pressed={selectedUserId === 0}
              >
                Próximo disponible
              </div>
            </div>
          )}

          <div className="mt-10 flex justify-between max-w-sm mx-auto">
            <button
              onClick={() => setStep(1)}
              className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-semibold px-6 py-3 rounded-md shadow-sm transition"
              aria-label="Volver"
            >
              Volver
            </button>
            <button
              disabled={selectedUserId === null}
              onClick={() => setStep(3)}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-md shadow-sm transition"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div>
          {profile?.name && (
            <p className="text-left mb-4 text-xl font-semibold text-blue-700 dark:text-blue-400">
              Hola, {profile?.name}
            </p>
          )}
          <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-600 dark:text-blue-400 drop-shadow-sm">
            Selecciona un servicio
          </h2>

          {isLoading ? (
            <p className="text-center text-gray-600 dark:text-gray-400">
              Cargando servicios...
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {services?.services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => setSelectedServiceId(service.id)}
                  className={`cursor-pointer border rounded-lg p-6 shadow-sm transition 
                    ${
                      selectedServiceId === service.id
                        ? "border-blue-600 shadow-blue-300 dark:shadow-blue-700"
                        : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                  tabIndex={0}
                  role="button"
                  aria-pressed={selectedServiceId === service.id}
                >
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    {service.name}
                  </h3>
                  {/* <p className="text-gray-600 dark:text-gray-300">
                    {service.description}
                  </p> */}
                  <p className="mt-3 font-bold text-blue-700 dark:text-blue-400">
                    ${service.price}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 flex justify-between max-w-sm mx-auto">
            <button
              onClick={() => setStep(2)}
              className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-semibold px-6 py-3 rounded-md shadow-sm transition"
              aria-label="Volver"
            >
              Volver
            </button>
            <button
              disabled={selectedServiceId === null}
              onClick={handleFinish}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-md shadow-sm transition"
            >
              Finalizar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceWizard;
