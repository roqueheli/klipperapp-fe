import httpInternalApi from "@/lib/common/http.internal.service";
import { Role, RoleResponse } from "@/types/role";

// Cache simple en memoria
const roleCache = new Map<string, Role>();

export const getRoleByName = async (name: string, useCache = true): Promise<Role> => {
    // Verificar caché primero
    if (useCache && roleCache.has(name)) {
        return roleCache.get(name)!;
    }

    try {
        const params = new URLSearchParams();
        params.set("name", name);

        const response = await httpInternalApi.httpGetPublic("/roles", params) as RoleResponse;

        if (!response.roles || response.roles.length === 0) {
            // Throw the specific error when role is not found
            throw new Error(`No se encontró el rol con nombre: ${name}`);
        }

        const role = response.roles[0];

        // Almacenar en caché
        if (useCache) {
            roleCache.set(name, role);
        }

        return role;
    } catch (error) {
        // Re-throw the original error if it's already specific, otherwise throw a generic one
        if (error instanceof Error && error.message.includes("No se encontró el rol")) {
            throw error; // Re-throw the specific error
        } else {
            console.error(`Error al obtener el rol ${name}:`, error);
            throw new Error(`Error al obtener el rol ${name}`);
        }
    }
};

// Limpiar caché manualmente si es necesario
export const clearRoleCache = () => {
    roleCache.clear();
};