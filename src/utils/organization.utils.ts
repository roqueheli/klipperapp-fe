import { Organization } from "@/types/organization";

// eslint-disable-next-line
export const isValidOrganization = (data: any): data is Organization => {
  return data && typeof data.name === "string" && typeof data.id === "number";
};

export const translateStatus = (status: string) => {
  switch (status) {
    case "pending":
      return "Pendiente";
    case "processing":
      return "En proceso";
    case "finished":
      return "Finalizado";
    case "completed":
      return "Completado";
    case "postponed":
      return "Pospuesto";
    case "canceled":
      return "Cancelado";
    default:
      return status;
  }
};

export const getStatusStyle = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
    case "processing":
      return "bg-yellow-200 text-yellow-900 dark:bg-yellow-500 dark:text-black";
    case "finished":
      return "bg-green-500 text-white"; // Verde claro, letras blancas
    case "completed":
      return "bg-green-900 text-green-300"; // Verde oscuro fondo, letras claras
    case "postponed":
      return "bg-red-200 text-red-900 dark:bg-red-500 dark:text-white";
    case "canceled":
      return "bg-red-600 text-white"; // Rojo fuerte, letras blancas
    default:
      return "bg-blue-200 text-blue-900 dark:bg-blue-500 dark:text-white";
  }
};

export const months = [
  { name: "Enero", value: "1" },
  { name: "Febrero", value: "2" },
  { name: "Marzo", value: "3" },
  { name: "Abril", value: "4" },
  { name: "Mayo", value: "5" },
  { name: "Junio", value: "6" },
  { name: "Julio", value: "7" },
  { name: "Agosto", value: "8" },
  { name: "Septiembre", value: "9" },
  { name: "Octubre", value: "10" },
  { name: "Noviembre", value: "11" },
  { name: "Diciembre", value: "12" },
];


export const availableStatuses = [
  { value: "completed", label: "Completado" },
  { value: "pending", label: "Pendiente" },
  { value: "cancelled", label: "Cancelado" },
  { value: "finished", label: "Finalizado" },
  { value: "postponed", label: "Postpuesto" },
  { value: "declined", label: "Declinada" },

];