import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import { MenuItem } from "@/types/user";

export const useFilteredMenus = (): MenuItem[] => {
    const { data, slug } = useOrganization();
    const { userData } = useUser();
    const roleName = userData?.role.name ?? "";

    const defaultMenus: MenuItem[] = [
        {
            label: "Registro de Entrada", // Antes: "Asistencia"
            path: `/${slug}/users/checkin`,
            allowedRoles: ["admin", "user"],
            icon: "LogIn"
        },
        {
            label: "Gestión de Turnos", // Antes: "Atención"
            path: `/${slug}/users/attendances`,
            allowedRoles: ["admin", "user"],
            icon: "CalendarCheck"
        },
        {
            label: "Filas de atención", // Antes: "Listas"
            path: `/${slug}/users/lists`,
            allowedRoles: ["admin", "user", "agent"],
            icon: "ListOrdered"
        },
        {
            label: "Atenciones del día", // Antes: "Transacciones"
            path: `/${slug}/transactions`,
            allowedRoles: ["admin", "user"],
            icon: "History"
        },
        {
            label: "Dashboard", // Opcional: "Estadísticas"
            path: `/${slug}/users/dashboard`,
            allowedRoles: ["admin", "user", "agent"],
            icon: "BarChart3"
        },
        {
            label: "Historial de atenciones", // Opcional: "Estadísticas"
            path: `/${slug}/attendances/history`,
            allowedRoles: ["admin", "user", "agent"],
            icon: "Clock"
        },
        {
            label: "Configuración",
            path: `/${slug}/users/settings`,
            allowedRoles: ["admin", "user", "agent"],
            icon: "Settings"
        },
    ];

    const menus: MenuItem[] =
        Array.isArray(data?.metadata?.menus) && data.metadata!.menus.length > 0
            ? (data?.metadata?.menus as MenuItem[])
            : defaultMenus;

    return menus.filter((menu) => menu.allowedRoles.includes(roleName));
};
