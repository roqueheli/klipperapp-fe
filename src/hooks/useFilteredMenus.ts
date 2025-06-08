import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import { MenuItem } from "@/types/user";

export const useFilteredMenus = (): MenuItem[] => {
    const { data, slug } = useOrganization();
    const { userData } = useUser();
    const roleId = userData?.role_id ?? 0;

    const defaultMenus: MenuItem[] = [
        {
            label: "Asistencia",
            path: `/${slug}/users/checkin`,
            allowedRoles: [1, 2],
        },
        {
            label: "Atención",
            path: `/${slug}/users/attendances`,
            allowedRoles: [1, 2],
        },
        {
            label: "Listas",
            path: `/${slug}/users/lists`,
            allowedRoles: [1, 2, 3],
        },
        {
            label: "Dashboard",
            path: `/${slug}/users/dashboard`,
            allowedRoles: [1, 2, 3],
        },
    ];

    const menus: MenuItem[] =
        data?.metadata?.menus?.length > 0
            ? (data?.metadata?.menus as MenuItem[])
            : defaultMenus;

    return menus.filter((menu) => menu.allowedRoles.includes(roleId));
};
