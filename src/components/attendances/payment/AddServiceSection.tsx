import { useTheme } from "@/components/ThemeProvider";
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
}: AddServiceSectionProps) => {
  const { theme } = useTheme();

  return (
    <div className="mb-6">
      <h5 className="text-lg font-medium mb-4">Agregar Servicios:</h5>
      <details
        className={`
          rounded 
          p-3 sm:p-4 md:p-5 
          max-h-[32rem] 
          overflow-y-auto 
          custom-scroll
          ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}
        `}
      >
        <summary className="cursor-pointer text-blue-600 hover:text-blue-700 mb-2">
          Mostrar/Ocultar Servicios
        </summary>

        <div className="my-4">
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar servicios..."
            className={`
              w-full border rounded px-3 py-2
              text-sm
              ${
                theme === "dark"
                  ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-900"
              }
            `}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {services.map((service) => (
            <div
              key={service.id}
              className={`
                p-3 rounded flex flex-col 
                transition
                ${
                  theme === "dark"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-black"
                }
              `}
            >
              <div>
                <p className="font-semibold">{service.name}</p>
                <p className="text-sm">Duración: {service.duration} min</p>
              </div>
              <button
                onClick={() => onAddService(service)}
                className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Agregar
              </button>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
};

export default AddServiceSection;
