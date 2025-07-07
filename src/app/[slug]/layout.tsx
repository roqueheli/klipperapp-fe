import { LogoutHandler } from "@/components/auth/handler/LogoutHandler";
import SidebarContainer from "@/components/sidebar/Sidebar.Container";
import ThemeProvider from "@/components/ThemeProvider";
import ToasterProvider from "@/components/ui/ToasterProvider";
import { BranchProvider } from "@/contexts/BranchContext";
import { OrganizationProvider } from "@/contexts/OrganizationContext";
import { UserProvider } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { getToken } from "@/lib/utils/auth.utils";
import "@/styles/globals.css";
import { Branch, BranchResponse } from "@/types/branch";
import { Organization, OrganizationResponse } from "@/types/organization";
import { User } from "@/types/user";
import { isValidOrganization } from "@/utils/organization.utils";
import { Metadata } from "next";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const slug = (await params).slug;

    const response = await httpInternalApi.httpGetPublic<OrganizationResponse>(
      "/organizations",
      new URLSearchParams({ slug })
    );

    const organization = response.organization;

    if (!organization) {
      throw new Error("No se encontró la organización");
    }

    return {
      title: organization.name ?? "KlipperApp",
      description: organization.bio ?? "Sistema de gestión para barberías",
      icons: {
        icon: organization.metadata?.media_configs?.favicon ?? "/favicon.ico",
      },
    };
  } catch {
    return {
      title: "KlipperApp",
      description: "Sistema de gestión para barberías",
      icons: {
        icon: "/favicon.ico",
      },
    };
  }
}

export default async function LayoutWithSlug({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const { slug } = await params;
  const pathname = (await headers()).get("x-next-pathname") || "";
  const isLoginPage = pathname.includes("/auth/login");
  const auth_token = await getToken();

  let initialData: Organization | null = null;
  let userData: User | null = null;
  let userBranches: Branch[] = [];

  try {
    const response = await httpInternalApi.httpGetPublic<OrganizationResponse>(
      "/organizations",
      new URLSearchParams({ slug })
    );
    initialData = response.organization;
  } catch {}

  if (auth_token) {
    const params = new URLSearchParams(String(initialData?.id ?? "") || "");
    try {
      const [branchesResponse, userResponse] = await Promise.all([
        httpInternalApi.httpGet<BranchResponse>(
          "/branches",
          params,
          auth_token
        ),
        httpInternalApi.httpGet<User>("/auth/me", undefined, auth_token),
      ]);

      userData = userResponse;
      userBranches = branchesResponse.branches;
    } catch {}
  }

  return (
    <ThemeProvider>
      <OrganizationProvider initialData={initialData} slug={slug}>
        <UserProvider userData={userData}>
          <BranchProvider
            initialBranches={userBranches}
            initialSelected={
              userData?.role?.name === "admin"
                ? userBranches[0]
                : userBranches?.find((b) => b.id === userData?.branch_id) ||
                  [][0]
            }
          >
            {/* 👇 Limpieza de logout (solo en cliente) */}
            <LogoutHandler />

            <div className="w-full flex min-h-[1000px]">
              {auth_token &&
                userData?.email_verified === true &&
                !isLoginPage &&
                isValidOrganization(initialData) && (
                  <SidebarContainer token={auth_token} />
                )}
              <div className="w-full transition-all duration-300 flex-grow">
                <main className="w-full flex-grow">{children}</main>
              </div>
            </div>
            <ToasterProvider />
          </BranchProvider>
        </UserProvider>
      </OrganizationProvider>
    </ThemeProvider>
  );
}
