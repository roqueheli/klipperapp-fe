"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function useClearFiltersOnNavigation(key: string) {
    const pathname = usePathname();

    useEffect(() => {
        const handleBeforeUnload = () => {
            sessionStorage.removeItem(key);
        };

        // Solo limpiar si se sale de esta ruta actual
        const previous = sessionStorage.getItem("__last_path");
        if (previous && previous !== pathname) {
            sessionStorage.removeItem(key);
        }

        sessionStorage.setItem("__last_path", pathname);

        // También lo limpiaremos si se recarga
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [pathname, key]);
}
