"use client";

import httpInternalApi from "@/lib/common/http.internal.service";
import { Attendance } from "@/types/attendance";
import { Organization } from "@/types/organization";
import { Profile, ProfileResponse } from "@/types/profile";
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
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [profile, setProfile] = useState<Profile>();
  const [users, setUsers] = useState<UserResponse>();
  const [services, setServices] = useState<ServiceResponse>();
  const [isLoading, setIsLoading] = useState(true);

  const handleFinish = async () => {
    if (
      !profile ||
      !selectedServiceId ||
      !organization ||
      !user
    ) {
      toast.error("Some data are missing to create the attendance.");
      return;
    }

    const requestBody = {
      profile_id: profile.id,
      organization_id: organization.id,
      branch_id: user?.branch_id,
      service_id: selectedServiceId,
      attended_by: selectedUserId !== 0 ? selectedUserId : null,
    };

    try {
      const response: Attendance = await toast.promise(
        httpInternalApi.httpPostPublic("/attendances", "POST", requestBody),
        {
          loading: "Creating attendance...",
          success: "Attendance successfully created.",
          error: "An error occurred while creating the attendance.",
        }
      );

      router.push(`/${slug}/users/attendances/${response?.id}`);

      setTimeout(() => {
        router.push(`/${slug}/users/lists`);
      }, 5000);
    } catch (error) {
      console.error("Error in the creation of assistance:", error);
    }
  };

  const handlePhoneSubmit = async () => {
    if (!phone) return;

    try {
      const phoneParam = new URLSearchParams();
      phoneParam.set("phone_number", phone);

      const response = (await httpInternalApi.httpGetPublic(`/profiles`, phoneParam)) as Promise<ProfileResponse>;

      if ((await response).status === 200) {
        setProfile((await response).profile);
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

  return (
    <div className="mt-24 px-4 max-w-4xl mx-auto">
      {/* Step 1 */}
      {step === 1 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ingresa tu número de teléfono
          </h2>
          <input
            type="tel"
            className="border px-4 py-2 rounded w-full max-w-sm"
            placeholder="Ej: +56912345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <div className="mt-6 flex justify-between gap-4">
            <button
              onClick={() => router.back()}
              className="cursor-pointer bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded"
            >
              Volver
            </button>
            <button
              disabled={!phone}
              className="cursor-pointer bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded disabled:opacity-50"
              onClick={handlePhoneSubmit}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div>
          {profile?.name && (
            <p className="text-left mb-2 text-lg font-semibold">
              Hola, {profile.name}
            </p>
          )}
          <h2 className="text-2xl font-bold mb-6 text-center">
            Selecciona un profesional
          </h2>

          {isLoading ? (
            <div className="text-center">Cargando usuarios...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {users?.users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center gap-2 ${
                    selectedUserId === user.id
                      ? "border-cyan-500"
                      : "hover:border-gray-400"
                  }`}
                >
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div className="text-lg font-medium">{user.name}</div>
                  <div className="flex gap-1 text-xl">
                    {/* {user?.skills.join(" ")} */}
                  </div>
                  {user.premium && (
                    <div className="text-yellow-500">⭐ Premium</div>
                  )}
                </div>
              ))}
              <div
                onClick={() => setSelectedUserId(0)}
                className={`cursor-pointer border rounded-lg p-4 flex items-center justify-center text-center ${
                  selectedUserId === 0
                    ? "border-cyan-500"
                    : "hover:border-gray-400"
                }`}
              >
                Próximo disponible
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="cursor-pointer bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded"
            >
              Volver
            </button>
            <button
              disabled={selectedUserId === null}
              onClick={() => setStep(3)}
              className="cursor-pointer bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded disabled:opacity-50"
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
            <p className="text-left mb-2 text-lg font-semibold">
              Hola, {profile.name}
            </p>
          )}
          <h2 className="text-2xl font-bold mb-6 text-center">
            Selecciona un servicio
          </h2>

          {isLoading ? (
            <div className="text-center">Cargando servicios...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {services?.services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => setSelectedServiceId(service.id)}
                  className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center gap-2 ${
                    selectedServiceId === service.id
                      ? "border-cyan-500"
                      : "hover:border-gray-400"
                  }`}
                >
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-32 object-cover rounded"
                  />
                  <div className="text-lg font-medium">{service.name}</div>
                  <div className="text-cyan-600 font-semibold">
                    ${service.price}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="cursor-pointer bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded"
            >
              Volver
            </button>
            <button
              disabled={selectedServiceId === null}
              onClick={handleFinish}
              className="cursor-pointer bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded disabled:opacity-50"
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
