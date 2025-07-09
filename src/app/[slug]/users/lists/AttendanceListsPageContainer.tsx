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
  hasPostponed: boolean;
}

export default function AttendanceListsPageContainer({
  isWorkingTodayEmpty,
  isAgent,
  users,
  queue,
  filteredServices,
  hasPostponed,
}: AttendanceListsPageContainerProps) {
  const { slug, data } = useOrganization();
  const { userData } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    userId: number;
    userName: string;
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
    setSelectedUser({ userId, userName });
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

  const handleEnd = async () => {
    if (!selectedAtt || !selectedUser) return;

    const requestBody = {
      user_id: selectedUser.userId,
      attendance_id: selectedAtt.attendance_id,
    };

    try {
      await toast.promise(
        httpInternalApi.httpPostPublic(
          "/users/end_attendance",
          "POST",
          requestBody
        ),
        {
          loading: "Ending attendance...",
          success: "Attendance successfully ended.",
          error: "Error ending attendance.",
        }
      );

      setModalOpen(false);
    } catch (error) {
      console.error("Error in end process:", error);
    }
  };

  const handleAddService = () => {
    setAddServiceModalOpen(true);
  };

  const handleConfirmServices = async (servicesToAdd: Service[]) => {
    if (!selectedAtt || !selectedUser) return;

    try {
      const requestBody = {
        id: selectedAtt.attendance_id,
        attendance: {
          id: selectedAtt.attendance_id,
          service_ids: servicesToAdd.map((s) => s.id),
        },
      };

      await toast.promise(
        httpInternalApi.httpPostPublic(
          `/attendances/${selectedAtt.attendance_id}`,
          "PUT",
          requestBody
        ),
        {
          loading: "Agregando servicios...",
          success: "Servicios agregados exitosamente.",
          error: "Error al agregar servicios.",
        }
      );

      setAddServiceModalOpen(false);
      setModalOpen(false);
      setSelectedServices([]);
    } catch (error) {
      console.error("Error al agregar servicios:", error);
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
        onFinish={handleEnd}
        onDecline={handleDecline}
        onResume={handleResume}
        onAddService={handleAddService}
        hasPostponed={hasPostponed}
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
          onConfirm={handleConfirmServices}
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
