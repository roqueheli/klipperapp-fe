import React from "react";

interface PhoneStepProps {
  phone: string;
  error: string | null;
  isUserListsRoute: boolean;
  onPhoneChange: (value: string) => void;
  onSubmit: () => void;
  onClose?: () => void;
}

const PhoneStep: React.FC<PhoneStepProps> = ({
  phone,
  error,
  isUserListsRoute,
  onPhoneChange,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="w-full flex justify-center items-center flex-col min-h-screen text-center">
      <h2 className="text-3xl font-extrabold mb-6 text-blue-600 dark:text-blue-400 drop-shadow-sm">
        Ingresa tu número de teléfono
      </h2>
      <input
        type="tel"
        className="border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-md w-full max-w-sm mx-auto text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition"
        placeholder="Ej: 9 1234 5678"
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
      />
      <div className="mt-8 flex justify-center gap-6 max-w-sm mx-auto">
        {isUserListsRoute && (
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-semibold px-6 py-3 rounded-md shadow-sm transition"
            aria-label="Volver"
          >
            Volver
          </button>
        )}
        <button
          disabled={!phone}
          onClick={onSubmit}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-md shadow-sm transition"
        >
          Siguiente
        </button>
      </div>
      {error && (
        <p className="mt-4 text-center text-red-600 dark:text-red-400 font-semibold">
          {error}
        </p>
      )}
    </div>
  );
};

export default PhoneStep;
