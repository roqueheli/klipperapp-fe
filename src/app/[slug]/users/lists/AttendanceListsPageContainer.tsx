"use client";

import { Transition } from "@headlessui/react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import AttendanceModal from "@/components/modal/AttendanceModal";
import AttendanceWizard from "../attendances/AttendanceWizard";

import FooterSection from "@/components/lists/FooterSection";
import HeaderSection from "@/components/lists/HeaderSection";
import QueueSection from "@/components/lists/QueueSection";
import UsersSection from "@/components/lists/UsersSection";

import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";

import AddServiceModal from "@/components/modal/AddServiceModal";
import { AttendanceProfile } from "@/types/attendance";
import { Organization } from "@/types/organization";
import { Service } from "@/types/service";
import { User, UserWithProfiles } from "@/types/user";

interface AttendanceListsPageContainerProps {
  isWorkingTodayEmpty: boolean;
  isAgent?: User;
  users: UserWithProfiles[];
  queue: User[];
  filteredServices: Service[];
}

export default function AttendanceListsPageContainer({
  isWorkingTodayEmpty,
  isAgent,
  users,
  queue,
  filteredServices,
}: AttendanceListsPageContainerProps) {
  const { slug, data } = useOrganization();
  const { userData } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    userId: number;
    userName: string;
    hasPostponed: boolean;
  } | null>(null);
  const [selectedAtt, setSelectedAtt] = useState<AttendanceProfile>();
  const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [localQueue, setLocalQueue] = useState<User[]>(queue);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLocalQueue(queue);
  }, [queue]);

  const handleClick = (
    userId: number,
    userName: string,
    att: AttendanceProfile
  ) => {
    const userFullData = users.find((u) => u.user.id === userId);
    const hasPostponed =
      userFullData?.profiles?.some((a) => a.status === "postponed") ?? false;

    setSelectedUser({ userId, userName, hasPostponed });
    setSelectedAtt(att);
    setModalOpen(true);
  };

  const handleStart = async () => {
    if (!selectedAtt || !selectedUser) return;

    const requestBody = {
      user_id: selectedUser.userId,
      attendance_id: selectedAtt.attendance_id,
    };

    try {
      await toast.promise(
        httpInternalApi.httpPostPublic(
          "/users/start_attendance",
          "POST",
          requestBody
        ),
        {
          loading: "Starting attendance...",
          success: "Attendance successfully started.",
          error: "Error starting attendance.",
        }
      );

      setModalOpen(false);
    } catch (error) {
      console.error("Error in start process:", error);
    }
  };

  const handlePostpone = async () => {
    if (!selectedAtt || !selectedUser) return;

    const requestBody = {
      user_id: selectedUser.userId,
      attendance_id: selectedAtt.attendance_id,
    };

    try {
      await toast.promise(
        httpInternalApi.httpPostPublic(
          "/users/postpone_attendance",
          "POST",
          requestBody
        ),
        {
          loading: "Postponing attendance...",
          success: "Attendance successfully postponed.",
          error: "Error postponing attendance.",
        }
      );

      setModalOpen(false);
    } catch (error) {
      console.error("Error in postpone process:", error);
    }
  };

  const handleDecline = async () => {
    if (!selectedAtt || !selectedUser) return;

    const requestBody = {
      user_id: selectedUser.userId,
      attendance_id: selectedAtt.attendance_id,
    };

    try {
      await toast.promise(
        httpInternalApi.httpPostPublic(
          "/users/cancel_attendance",
          "POST",
          requestBody
        ),
        {
          loading: "Declining attendance...",
          success: "Attendance successfully declined.",
          error: "Error declining attendance.",
        }
      );

      setModalOpen(false);
    } catch (error) {
      console.error("Error in decline process:", error);
    }
  };

  const handleResume = async () => {
    if (!selectedAtt || !selectedUser) return;

    const requestBody = {
      user_id: selectedUser.userId,
      attendance_id: selectedAtt.attendance_id,
    };

    try {
      await toast.promise(
        httpInternalApi.httpPostPublic(
          "/users/resume_attendance",
          "POST",
          requestBody
        ),
        {
          loading: "Resuming attendance...",
          success: "Attendance successfully resumed.",
          error: "Error resuming attendance.",
        }
      );

      setModalOpen(false);
    } catch (error) {
      console.error("Error in resume process:", error);
    }
  };

  const handleAddService = () => {
    setAddServiceModalOpen(true);
  };

  const handleConfirmAndEnd = async (servicesToAdd: Service[], tip: number) => {
    if (!selectedAtt || !selectedUser) return;

    const putBody = {
      id: selectedAtt.attendance_id,
      attendance: {
        id: selectedAtt.attendance_id,
        service_ids: servicesToAdd.map((s) => s.id),
        tip_amount: tip,
      },
    };

    const postBody = {
      user_id: selectedUser.userId,
      attendance_id: selectedAtt.attendance_id,
    };

    try {
      await toast.promise(
        Promise.all([
          httpInternalApi.httpPostPublic(
            `/attendances/${selectedAtt.attendance_id}`,
            "PUT",
            putBody
          ),
          httpInternalApi.httpPostPublic(
            "/users/end_attendance",
            "POST",
            postBody
          ),
        ]),
        {
          loading: "Finalizando atención...",
          success: "Atención finalizada exitosamente.",
          error: "Error al finalizar atención.",
        }
      );

      setAddServiceModalOpen(false);
      setModalOpen(false);
      setSelectedServices([]);
    } catch (error) {
      console.error("Error en el proceso de finalizar:", error);
    }
  };

  const filteredServicesBySearch = useMemo(() => {
    if (!search) return filteredServices;
    const lower = search.toLowerCase();

    return filteredServices.filter((service) =>
      service.name?.toLowerCase().includes(lower)
    );
  }, [filteredServices, search]);

  return (
    <div className="w-full mx-auto p-6 min-h-screen flex flex-col">
      <HeaderSection />
      <main className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-grow">
        <QueueSection queue={localQueue} />
        <UsersSection
          users={users}
          userLogged={isAgent || undefined}
          onUserClick={handleClick}
        />
      </main>
      {!isAgent && (
        <FooterSection
          isEmpty={isWorkingTodayEmpty}
          onStartWizard={() => setWizardOpen(true)}
        />
      )}

      <AttendanceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        att={selectedAtt || null}
        userName={selectedUser?.userName || ""}
        onStart={handleStart}
        onPostpone={handlePostpone}
        onDecline={handleDecline}
        onResume={handleResume}
        onAddService={handleAddService}
        hasPostponed={selectedUser?.hasPostponed || false}
      />

      {selectedAtt && addServiceModalOpen && (
        <AddServiceModal
          isOpen={addServiceModalOpen}
          onClose={() => setAddServiceModalOpen(false)}
          attendanceProfile={selectedAtt as AttendanceProfile}
          setSelectedServices={setSelectedServices}
          selectedServices={selectedServices}
          filteredServices={filteredServicesBySearch}
          search={search}
          onSearchChange={setSearch}
          onAddService={(s) => {
            setSelectedServices((prev) => [...prev, s]);
            toast.success(`Servicio ${s.name} agregado exitosamente.`, {
              duration: 3000,
              style: {
                animation: "fade-out-slow 3s forwards",
                width: "600px",
              },
            });
          }}
          onRemoveService={(id) => {
            setSelectedServices((prev) => prev.filter((s) => s.id !== id));
            toast.success("Servicio eliminado exitosamente.", {
              duration: 3000,
              style: {
                animation: "fade-out-slow 3s forwards",
                width: "600px",
              },
            });
          }}
          onFinish={handleConfirmAndEnd}
        />
      )}

      <Transition
        show={wizardOpen}
        enter="transition ease-out duration-600"
        enterFrom="translate-x-full opacity-0"
        enterTo="translate-x-0 opacity-100"
        leave="transition ease-in duration-400"
        leaveFrom="translate-x-0 opacity-100"
        leaveTo="translate-x-full opacity-0"
      >
        <div className="rounded-sm fixed inset-0 z-50 flex justify-end">
          <div className="overflow-x-hidden overflow-auto w-[72%] rounded-lg shadow-lg z-50">
            <div className="relative top-9 left-3 flex justify-start">
              <button
                className="hover:text-gray-700"
                onClick={() => setWizardOpen(false)}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <AttendanceWizard
              slug={slug || ""}
              organization={data as Organization}
              user={userData as User}
              onClose={() => setWizardOpen(false)}
            />
          </div>
        </div>
      </Transition>
    </div>
  );
}
