import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import { MenuItem } from "@/types/user";

export const useFilteredMenus = (): MenuItem[] => {
    const { data, slug } = useOrganization();
    const { userData } = useUser();
    const roleName = userData?.role.name ?? "";

    const defaultMenus: MenuItem[] = [
        {
            "label": "Cuadre de caja",
            "path": `/${slug}/till-check`,
            "allowedRoles": ["admin", "user"],
            "icon": "BanknoteArrowUp"
        },
        {
            label: "Registro de Entrada",
            path: `/${slug}/users/checkin`,
            allowedRoles: ["admin", "user"],
            icon: "LogIn"
        },
        {
            label: "Gestión de Turnos",
            path: `/${slug}/users/attendances`,
            allowedRoles: ["admin", "user", "viewer"],
            icon: "CalendarCheck"
        },
        {
            label: "Filas de atención",
            path: `/${slug}/users/lists`,
            allowedRoles: ["admin", "user", "agent"],
            icon: "ListOrdered"
        },
        {
            label: "Atenciones del día",
            path: `/${slug}/transactions`,
            allowedRoles: ["admin", "user", "agent"],
            icon: "History"
        },
        {
            label: "Atenciones anteriores",
            path: `/${slug}/attendances/history`,
            allowedRoles: ["admin", "user", "agent"],
            icon: "Clock"
        },
        {
            "label": "Reporte de gastos",
            "path": `/${slug}/organization/expenses`,
            "allowedRoles": ["admin", "user"],
            "icon": "FileBarChart2"
        },
        {
            "label": "Gestión de pagos",
            "path": `/${slug}/management`,
            "allowedRoles": ["admin", "user", "agent"],
            "icon": "Wallet"
        },
        {
            label: "Dashboard",
            path: `/${slug}/users/dashboard`,
            allowedRoles: ["admin", "user", "agent"],
            icon: "BarChart3"
        },
        {
            label: "Configuración",
            path: `/${slug}/users/settings`,
            allowedRoles: ["admin", "user", "agent"],
            icon: "Settings"
        }
    ];

    const menus: MenuItem[] =
        Array.isArray(data?.metadata?.menus) && data.metadata!.menus.length > 0
            ? (data?.metadata?.menus as MenuItem[])
            : defaultMenus;

    return menus.filter((menu) => menu.allowedRoles.includes(roleName));
};
