export const SearchAndSortBar = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (val: "asc" | "desc") => void;
}) => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
    <input
      type="text"
      placeholder="🔍 Buscar por nombre, servicio o profesional"
      className="input input-bordered w-full md:w-1/2"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <div className="flex items-center gap-3">
      <label className="text-gray-600 dark:text-gray-300 font-medium">
        Ordenar por:
      </label>
      <select
        className="select select-bordered"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="created_at">Fecha</option>
        <option value="status">Estado</option>
      </select>
      <button
        className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline"
        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
      >
        {sortOrder === "asc" ? "Ascendente" : "Descendente"}
      </button>
    </div>
  </div>
);
