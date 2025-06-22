"use client";

import { useEffect, useState } from "react";

export function usePersistedState<T>(
    key: string,
    fallbackValue?: T
): [T, (value: T) => void] {
    const [state, setState] = useState<T>(() => {
        if (typeof window === "undefined") return fallbackValue as T;

        const stored = sessionStorage.getItem(key);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error("Error al parsear sessionStorage:", e);
            }
        }
        return fallbackValue as T;
    });

    useEffect(() => {
        if (state !== undefined) {
            sessionStorage.setItem(key, JSON.stringify(state));
        }
    }, [key, state]);

    return [state, setState];
}
