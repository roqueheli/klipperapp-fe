import { Service } from "@/types/service";

interface ServiceListProps {
  services: Service[];
  onRemove: (id: number) => void;
}

const ServiceList = ({ services, onRemove }: ServiceListProps) => {
  const uniqueServices = [...new Set(services.map((s) => s.id))];

  return (
    <ul className="space-y-2">
      {uniqueServices.map((id) => {
        const service = services.find((s) => s.id === id);
        const count = services.filter((s) => s.id === id).length;
        return (
          <li
            key={id}
            className="p-3 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold">{service?.name}</p>
              <p className="text-sm">Duración: {service?.duration} min</p>
            </div>
            <p className="text-sm font-medium">
              {count > 1 ? `x${count}` : ""}
            </p>
            <p className="text-sm font-medium">
              {Number(service?.price).toLocaleString("es-CL", {
                style: "currency",
                currency: "CLP",
              })}
            </p>
            <p className="text-sm font-medium">
              {(Number(service?.price) * count).toLocaleString("es-CL", {
                style: "currency",
                currency: "CLP",
              })}
            </p>
            <button
              className="text-red-600 hover:text-red-700"
              onClick={() => onRemove(id)}
            >
              Eliminar
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default ServiceList;
