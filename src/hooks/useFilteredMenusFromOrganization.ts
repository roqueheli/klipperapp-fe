"use client";

import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import { MenuItem } from "@/types/user";

export function useFilteredMenusFromOrganization(): MenuItem[] {
    const { slug, data: organization } = useOrganization();
    const { userData } = useUser();
    const defaultMenus: MenuItem[] = [
        {
            label: "Registro de Entrada",
            path: `/${slug}/users/checkin`,
            allowedRoles: [1, 2],
            icon: "LogIn"
        },
        {
            label: "Gestión de Turnos",
            path: `/${slug}/users/attendances`,
            allowedRoles: [1, 2],
            icon: "CalendarCheck"
        },
        {
            label: "Filas de atención",
            path: `/${slug}/users/lists`,
            allowedRoles: [1, 2, 7, 3],
            icon: "ListOrdered"
        },
        {
            label: "Atenciones del día",
            path: `/${slug}/transactions`,
            allowedRoles: [1, 2, 3, 7],
            icon: "History"
        },
        {
            label: "Atenciones anteriores",
            path: `/${slug}/attendances/history`,
            allowedRoles: [1, 2, 7, 3],
            icon: "Clock"
        },
        {
            "label": "Reporte de gastos",
            "path": `/${slug}/organization/expenses`,
            "allowedRoles": [1, 2],
            "icon": "FileBarChart2"
        },
        {
            "label": "Gestión de pagos",
            "path": `/${slug}/management`,
            "allowedRoles": [1, 2, 3, 7],
            "icon": "Wallet"
        },
        {
            label: "Dashboard",
            path: `/${slug}/users/dashboard`,
            allowedRoles: [1, 2, 7, 3],
            icon: "BarChart3"
        },
        {
            label: "Configuración",
            path: `/${slug}/users/settings`,
            allowedRoles: [1, 2, 7, 3],
            icon: "Settings"
        },
    ];

    const roleId = userData?.role?.id;

    if (!organization || roleId === undefined) return [];

    const allMenus: MenuItem[] = organization.metadata?.menus ?? defaultMenus;

    return allMenus.filter((menu) => {
        return (
            !menu.allowedRoles ||
            (Array.isArray(menu.allowedRoles) &&
                menu.allowedRoles.includes(roleId))
        );
    });
}
