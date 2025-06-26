import { Service } from "@/types/service";

interface AddServiceSectionProps {
  services: Service[];
  search: string;
  onSearchChange: (value: string) => void;
  onAddService: (service: Service) => void;
}

const AddServiceSection = ({
  services,
  search,
  onSearchChange,
  onAddService,
}: AddServiceSectionProps) => (
  <div className="mb-6">
    <h5 className="text-lg font-medium mb-4">Agregar Servicios:</h5>
    <details className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
      <summary className="cursor-pointer text-blue-600 hover:text-blue-700">
        Mostrar/Ocultar Servicios
      </summary>
      <div className="flex items-center justify-between mb-4">
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar servicios..."
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2"
        />
      </div>
      <div className="overflow-y-auto max-h-80 grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="p-3 rounded bg-white dark:bg-gray-800 flex flex-col"
          >
            <div>
              <p className="font-semibold">{service.name}</p>
              <p className="text-sm">Duración: {service.duration} min</p>
            </div>
            <button
              onClick={() => onAddService(service)}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Agregar
            </button>
          </div>
        ))}
      </div>
    </details>
  </div>
);

export default AddServiceSection;
