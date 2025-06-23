"use client";

import { Transition } from "@headlessui/react";
import { startTransition, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import AttendanceModal from "@/components/modal/AttendanceModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AttendanceWizard from "../attendances/AttendanceWizard";

import FooterSection from "@/components/lists/FooterSection";
import HeaderSection from "@/components/lists/HeaderSection";
import QueueSection from "@/components/lists/QueueSection";
import UsersSection from "@/components/lists/UsersSection";

import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import { useIsWorkingTodayEmpty } from "@/hooks/useIsWorkingTodayEmpty";
import httpInternalApi from "@/lib/common/http.internal.service";

import { Organization } from "@/types/organization";
import { User, UserWithProfiles } from "@/types/user";
import { getRoleByName } from "@/utils/roleUtils";

export interface AttendanceProfile {
  id: number;
  attendance_id?: number;
  name: string;
  status: "pending" | "processing" | "finished";
}

export default function AttendanceListsPage() {
  const [users, setUsers] = useState<UserWithProfiles[]>([]);
  const [queue, setQueue] = useState<User[]>([]);
  const { slug, data } = useOrganization();
  const { userData } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    userId: number;
    userName: string;
  } | null>(null);
  const [selectedAtt, setSelectedAtt] = useState<AttendanceProfile>();
  const [isLoading, setIsLoading] = useState(true);
  const isWorkingTodayEmpty = useIsWorkingTodayEmpty();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    const agentRole = await getRoleByName("agent");

    if (data?.id) {
      params.set("organization_id", String(data.id));
      params.set("role_id", String(agentRole?.id));
    }
    params.set("branch_id", String(userData?.branch_id || 1));

    try {
      const [queueRes, usersRes] = await Promise.all([
        httpInternalApi.httpGetPublic("/attendances/by_users_queue"),
        httpInternalApi.httpGetPublic(
          "/attendances/by_usersworking_today",
          params
        ),
      ]);

      startTransition(() => {
        setQueue(queueRes as User[]);
        setUsers(usersRes as UserWithProfiles[]);
      });
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setIsLoading(false);
    }
  }, [data?.id, userData?.branch_id]);

  const fetchQueue = useCallback(async () => {
    try {
      const queueRes = await httpInternalApi.httpGetPublic(
        "/attendances/by_users_queue"
      );
      setQueue(queueRes as User[]);
    } catch (error) {
      console.error("Error al cargar la queue:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleClick = (
    userId: number,
    userName: string,
    att: AttendanceProfile
  ) => {
    setSelectedUser({ userId, userName });
    setSelectedAtt(att);
    setModalOpen(true);
  };

  const updateAttendanceStatus = (
    userId: number,
    attId: number,
    status: "pending" | "processing" | "finished" | "postponed" | "canceled"
  ) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.user.id !== userId) return user;
        const updatedProfiles = user.profiles
          .map((att) => (att.id === attId ? { ...att, status } : att))
          .filter(
            (att) => att.status === "pending" || att.status === "processing" || att.status === "postponed"
          );

        return { ...user, profiles: updatedProfiles };
      })
    );
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
      updateAttendanceStatus(selectedUser.userId, selectedAtt.id, "processing");
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
      updateAttendanceStatus(selectedUser.userId, selectedAtt.id, "postponed");
      setModalOpen(false);
      await fetchQueue();
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
      updateAttendanceStatus(selectedUser.userId, selectedAtt.id, "canceled");
      setModalOpen(false);
      await fetchQueue();
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
      updateAttendanceStatus(selectedUser.userId, selectedAtt.id, "pending");
      setModalOpen(false);
      await fetchQueue();
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
      updateAttendanceStatus(selectedUser.userId, selectedAtt.id, "finished");
      setModalOpen(false);
      await fetchQueue();
    } catch (error) {
      console.error("Error in end process:", error);
    }
  };

  const hasProcessing = users.some(u => u.profiles.some(p => p.status === "processing"));

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="w-full mx-auto px-4 md:px-6 py-6 min-h-screen flex flex-col">
      <HeaderSection />
      <main className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-grow">
        <QueueSection queue={queue} />
        <UsersSection users={users} onUserClick={handleClick} />
      </main>
      <FooterSection
        isEmpty={isWorkingTodayEmpty}
        onStartWizard={() => setWizardOpen(true)}
      />

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
        hasProcessing={hasProcessing}
      />

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
                className="text-white hover:text-gray-700"
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
