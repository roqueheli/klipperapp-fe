"use client";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) => {
  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;

  return (
    <div className="flex justify-center items-center gap-3 mt-6">
      <button
        onClick={() => canGoBack && onPageChange(currentPage - 1)}
        disabled={!canGoBack}
        className="px-3 py-1 rounded-md border text-sm dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition"
      >
        ← Anterior
      </button>

      <span className="text-sm text-gray-700 dark:text-gray-300">
        Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
      </span>

      <button
        onClick={() => canGoForward && onPageChange(currentPage + 1)}
        disabled={!canGoForward}
        className="px-3 py-1 rounded-md border text-sm dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition"
      >
        Siguiente →
      </button>
    </div>
  );
};

export default PaginationControls;
