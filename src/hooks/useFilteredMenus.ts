import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import { MenuItem } from "@/types/user";

export const useFilteredMenus = (): MenuItem[] => {
    const { data, slug } = useOrganization();
    const { userData } = useUser();
    const roleId = userData?.role_id ?? 0;

    const defaultMenus: MenuItem[] = [
        {
            label: "Registro de Entrada", // Antes: "Asistencia"
            path: `/${slug}/users/checkin`,
            allowedRoles: [1, 2],
        },
        {
            label: "Gestión de Turnos", // Antes: "Atención"
            path: `/${slug}/users/attendances`,
            allowedRoles: [1, 2],
        },
        {
            label: "Filas de atención", // Antes: "Listas"
            path: `/${slug}/users/lists`,
            allowedRoles: [1, 2, 3],
        },
        {
            label: "Historial de Atenciones", // Antes: "Transacciones"
            path: `/${slug}/transactions`,
            allowedRoles: [1, 2],
        },
        {
            label: "Dashboard", // Opcional: "Estadísticas"
            path: `/${slug}/users/dashboard`,
            allowedRoles: [1, 2, 3],
        },
        {
            label: "Configuración",
            path: `/${slug}/users/settings`,
            allowedRoles: [1, 2, 3],
        },
    ];

    const menus: MenuItem[] =
        Array.isArray(data?.metadata?.menus) && data.metadata!.menus.length > 0
            ? (data?.metadata?.menus as MenuItem[])
            : defaultMenus;

    return menus.filter((menu) => menu.allowedRoles.includes(roleId));
};
