"use client";

import { useTheme } from "@/components/ThemeProvider";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Profile } from "@/types/profile";
import { Mail, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";

interface PhoneStepProps {
  phone: string;
  error: string | null;
  isUserListsRoute: boolean;
  onPhoneChange: (value: string) => void;
  onSubmit: () => void;
  onSelectProfile: (profile: Profile) => void;
  onClose?: () => void;
}

const PhoneStep: React.FC<PhoneStepProps> = ({
  phone,
  error,
  isUserListsRoute,
  onPhoneChange,
  onSubmit,
  onSelectProfile,
  onClose,
}) => {
  const { theme } = useTheme();
  const [results, setResults] = useState<Profile[]>([]);
  const [wasSelectedFromDropdown, setWasSelectedFromDropdown] = useState(false);

  useEffect(() => {
    if (wasSelectedFromDropdown) {
      setWasSelectedFromDropdown(false);
      return;
    }

    const fetchProfiles = async () => {
      if (phone.length < 3) {
        setResults([]);
        return;
      }

      const params = new URLSearchParams();
      params.set("query", phone);

      try {
        const res = (await httpInternalApi.httpGetPublic(
          "/profiles/search",
          params
        )) as Profile[];

        setResults(res || []);
      } catch (e) {
        console.error("Error al buscar:", e);
        setResults([]);
      }
    };

    const timeout = setTimeout(() => {
      fetchProfiles();
    }, 400);

    return () => clearTimeout(timeout);
  }, [phone]);

  return (
    <div className="w-full flex justify-center items-center flex-col min-h-screen text-center">
      <h2
        className={`text-3xl font-extrabold mb-6 ${
          theme === "dark" ? "text-blue-400" : "text-blue-600"
        } drop-shadow-sm`}
      >
        Ingresa tu número de teléfono
      </h2>

      <div className="relative w-full max-w-lg mx-auto">
        <input
          type="text"
          className={`border placeholder:text-gray-400 ${
            theme === "dark"
              ? "border-gray-700 focus:ring-blue-500"
              : "focus:ring-blue-400"
          } px-4 py-3 rounded-md w-full text-lg focus:outline-none focus:ring-2 transition`}
          placeholder="Teléfono, nombre o correo"
          value={phone}
          onChange={(e) => {
            const value = e.target.value;
            onPhoneChange(value);
          }}
        />

        {results.length > 0 && (
          <ul
            className={`absolute z-10 ${
              theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"
            } border w-full rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto`}
          >
            {results.map((r) => (
              <li
                key={r.id}
                onClick={() => {
                  onPhoneChange(r.phone_number);
                  setResults([]);
                  setWasSelectedFromDropdown(true);
                  onSelectProfile(r);
                }}
                className={`flex gap-2 items-center p-3 ${
                  theme === "dark"
                    ? "hover:bg-blue-900 border-gray-700"
                    : "hover:bg-blue-100 border-gray-100"
                } cursor-pointer text-left transition-colors border-b`}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <User
                    className={`w-4 h-4 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <span className="font-small capitalize truncate">
                    {r.name}
                  </span>
                </div>
                <div
                  className={`flex items-center justify-center gap-2 text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <Phone className="w-4 h-4" /> {r.phone_number}
                </div>
                <div
                  className={`flex items-center justify-center gap-2 text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <Mail className="w-4 h-4" /> {r.email}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && (
        <p className="mt-4 text-center text-red-600 dark:text-red-400 font-semibold">
          {error}
        </p>
      )}

      <div className="mt-8 flex justify-center gap-6 max-w-sm mx-auto">
        {isUserListsRoute && (
          <button
            onClick={onClose}
            className={`flex-1 ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
                : "bg-gray-300 hover:bg-gray-400 text-gray-900"
            } font-semibold px-6 py-3 rounded-md shadow-sm transition`}
            aria-label="Volver"
          >
            Volver
          </button>
        )}
        <button
          disabled={!phone}
          onClick={onSubmit}
          className={
            "flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-md shadow-sm transition"
          }
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default PhoneStep;
