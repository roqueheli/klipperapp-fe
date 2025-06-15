const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <svg
      className="animate-spin -ml-1 mr-3 h-20 w-20 text-blue-700"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Cargando..."
      role="img"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  </div>
);

export default LoadingSpinner;
