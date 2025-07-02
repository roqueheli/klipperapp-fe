"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Attendance, Attendances, ServicesResponse } from "@/types/attendance";
import { Organization } from "@/types/organization";
import { Service } from "@/types/service";
import { User } from "@/types/user";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PaymentsContainer from "./PaymentsContainer";

const PaymentsPage = () => {
  const { slug, data } = useOrganization();
  const { userData } = useUser();
  const { id } = useParams();
  const router = useRouter();

  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [selectedAttendances, setSelectedAttendances] = useState<Attendance[]>(
    []
  );
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentType, setPaymentType] = useState("Efectivo");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSunday, setIsSunday] = useState(false);

  useEffect(() => {
    const attendanceParams = new URLSearchParams();
    attendanceParams.set("id", String(id));

    setIsSunday(
      new Date(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Santiago",
        }).format(new Date())
      ).getDay() === 0
    );

    const fetchAttendance = async () => {
      try {
        const response = (await httpInternalApi.httpGetPublic(
          "/attendances",
          attendanceParams
        )) as Attendances;
        setAttendance(response?.attendances[0]);
        setSelectedServices(response?.attendances[0].services || []);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchServices = async () => {
      try {
        const response = (await httpInternalApi.httpGetPublic(
          "/services"
        )) as ServicesResponse;
        setAvailableServices(response.services);
      } catch {}
    };

    fetchAttendance();
    fetchServices();
  }, [id]);

  if (isLoading || !attendance) return <LoadingSpinner />;

  const allServices = [
    ...selectedServices,
    ...selectedAttendances.flatMap((a) => a.services || []),
  ];

  const total = allServices.reduce(
    (sum, service) => sum + Number(service.price || 0),
    0
  );
  const finalTotal = total - discount;
  const amountPaid = finalTotal;

  const handleExecuteTransaction = async () => {
    const allAttendances = [attendance, ...selectedAttendances];

    const extraDiscount = isSunday
      ? 0
      : Number(data?.metadata?.billing_configs?.extra_discount ?? 0);

    const userPercentage = Number(
      data?.metadata?.billing_configs?.user_percentage ?? 0
    );
    const orgPercentage = Number(
      data?.metadata?.billing_configs?.organization_percentage ?? 0
    );

    try {
      await Promise.all(
        allAttendances.map(async (a) => {
          const aServices =
            a.id === attendance.id ? [...selectedServices] : a.services ?? [];

          const localTotal = aServices.reduce(
            (sum, s) => sum + Number(s.price || 0),
            0
          );

          const localRequest = {
            user_id: a.attended_by,
            attendance_id: a.id,
            attendance: {
              discount: a.id === attendance.id ? discount : 0,
              extra_discount: extraDiscount,
              user_amount:
                localTotal * (userPercentage / 100) -
                (extraDiscount > 0 ? extraDiscount / 2 : 0),
              organization_amount:
                localTotal * (orgPercentage / 100) -
                (extraDiscount > 0 ? extraDiscount / 2 : 0),
              total_amount: localTotal,
              payment_method: paymentType,
              service_ids: aServices.map((s) => s.id),
              child_attendance_ids:
                a.id === attendance.id
                  ? allAttendances.map((a) => a.id).filter((id) => id !== a.id)
                  : [],
            },
          };

          return httpInternalApi.httpPostPublic(
            "/users/finish_attendance",
            "POST",
            localRequest
          );
        })
      );

      toast.success("Asistencias finalizadas correctamente.");
      router.push(`/${slug}/transactions`);
    } catch {
      toast.error("Ocurrió un error al finalizar una o más asistencias.");
    }
  };

  const handleAddService = (service: Service) => {
    setSelectedServices((prev) => [...prev, service]);
  };

  const handleAddServiceToAttendance = (
    attendanceId: number,
    service: Service
  ) => {
    setSelectedAttendances((prev) =>
      prev.map((a) =>
        a.id === attendanceId
          ? { ...a, services: [...(a.services || []), service] }
          : a
      )
    );
  };

  const handleUpdateAttendance = (updatedAttendance: Attendance) => {
    setSelectedAttendances((prev) =>
      prev.map((a) => (a.id === updatedAttendance.id ? updatedAttendance : a))
    );
  };

  return (
    <PaymentsContainer
      organization={data as Organization}
      userData={userData as User}
      attendance={attendance}
      services={selectedServices}
      total={total}
      finalTotal={finalTotal}
      amountPaid={amountPaid}
      discount={discount}
      paymentType={paymentType}
      availableServices={availableServices}
      search={search}
      isModalOpen={isModalOpen}
      selectedAttendances={selectedAttendances}
      setSelectedAttendances={setSelectedAttendances}
      setIsModalOpen={setIsModalOpen}
      setSearch={setSearch}
      handleAddService={handleAddService}
      handleAddServiceToAttendance={handleAddServiceToAttendance}
      handleExecuteTransaction={handleExecuteTransaction}
      setSelectedServices={setSelectedServices}
      setPaymentType={setPaymentType}
      setDiscount={setDiscount}
      handleUpdateAttendance={handleUpdateAttendance}
    />
  );
};

export default PaymentsPage;
