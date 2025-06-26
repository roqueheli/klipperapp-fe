import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import { MenuItem } from "@/types/user";

export const useFilteredMenus = (): MenuItem[] => {
    const { data, slug } = useOrganization();
    const { userData } = useUser();
    const roleId = userData?.role.id ?? 0;

    const defaultMenus: MenuItem[] = [
        {
            label: "Registro de Entrada", // Antes: "Asistencia"
            path: `/${slug}/users/checkin`,
            allowedRoles: [1, 2],
            icon: "LogIn"
        },
        {
            label: "Gestión de Turnos", // Antes: "Atención"
            path: `/${slug}/users/attendances`,
            allowedRoles: [1, 2],
            icon: "CalendarCheck"
        },
        {
            label: "Filas de atención", // Antes: "Listas"
            path: `/${slug}/users/lists`,
            allowedRoles: [1, 2, 7, 3],
            icon: "ListOrdered"
        },
        {
            label: "Atenciones del día", // Antes: "Transacciones"
            path: `/${slug}/transactions`,
            allowedRoles: [1, 2],
            icon: "History"
        },
        {
            label: "Dashboard", // Opcional: "Estadísticas"
            path: `/${slug}/users/dashboard`,
            allowedRoles: [1, 2, 7, 3],
            icon: "BarChart3"
        },
        {
            label: "Historial de atenciones", // Opcional: "Estadísticas"
            path: `/${slug}/attendances/history`,
            allowedRoles: [1, 2, 7, 3],
            icon: "Clock"
        },
        {
            label: "Configuración",
            path: `/${slug}/users/settings`,
            allowedRoles: [1, 2, 7, 3],
            icon: "Settings"
        },
    ];

    const menus: MenuItem[] =
        Array.isArray(data?.metadata?.menus) && data.metadata!.menus.length > 0
            ? (data?.metadata?.menus as MenuItem[])
            : defaultMenus;

    return menus.filter((menu) => menu.allowedRoles.includes(roleId));
};
