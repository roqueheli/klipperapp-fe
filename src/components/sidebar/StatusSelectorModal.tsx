"use client";

import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import clsx from "clsx";
import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTheme } from "../ThemeProvider";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  avatarRef: React.RefObject<HTMLElement>;
}

interface response {
  message: string;
}

export default function StatusSelectorModal({
  isOpen,
  onClose,
  avatarRef,
}: Props) {
  const { theme } = useTheme();
  const { userData, setUserData } = useUser();
  const modalRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState(
    userData?.work_state === "not_available" ? "not_available" : "available"
  );

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res: response = await httpInternalApi.httpPostPublic(
        `/users/${userData?.id}/${
          newStatus === "not_available" ? "not_available" : "available"
        }`,
        "PATCH",
        { id: userData?.id }
      );

      toast.success(`Status changed to ${res.message}`);

      setUserData({ ...userData!, work_state: newStatus });
      setStatus(newStatus);
      onClose();
    } catch {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        modalRef.current &&
        !modalRef.current.contains(target) &&
        avatarRef.current &&
        !avatarRef.current.contains(target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, avatarRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className={clsx(
        "absolute bottom-15 left-0 z-50 w-64 rounded-xl p-5 border shadow-xl transition-all animate-fade-in-up backdrop-blur-lg",
        theme === "dark"
          ? "bg-gray-900/80 border-gray-700 text-white"
          : "bg-white/80 border-gray-300 text-gray-800"
      )}
    >
      <p
        className={clsx(
          "text-xs tracking-widest uppercase font-semibold mb-4",
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        )}
      >
        Cambiar estado
      </p>

      <div className="flex flex-col gap-3">
        {[
          {
            label: "Disponible",
            value: "available",
            icon: <CheckCircle className="text-green-500 w-5 h-5" />,
          },
          {
            label: "No disponible",
            value: "not_available",
            icon: <XCircle className="text-gray-400 w-5 h-5" />,
          },
        ].map((option) => (
          <label
            key={option.value}
            className={clsx(
              "flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all group",
              status === option.value
                ? theme === "dark"
                  ? "bg-gray-800 border-green-500"
                  : "bg-green-100 border-green-400"
                : theme === "dark"
                ? "hover:bg-gray-800 border-gray-700"
                : "hover:bg-gray-100 border-gray-300"
            )}
          >
            <input
              type="radio"
              name="status"
              value={option.value}
              checked={status === option.value}
              onChange={() => handleStatusChange(option.value)}
              className="form-radio accent-green-500"
            />
            <div className="flex items-center gap-2">
              {option.icon}
              <span className="text-sm font-medium">{option.label}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
