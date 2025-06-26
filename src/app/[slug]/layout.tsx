import SidebarContainer from "@/components/sidebar/Sidebar.Container";
import ThemeProvider from "@/components/ThemeProvider";
import ToasterProvider from "@/components/ui/ToasterProvider";
import { OrganizationProvider } from "@/contexts/OrganizationContext";
import { UserProvider } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { getToken } from "@/lib/utils/auth.utils";
import "@/styles/globals.css";
import { Organization, OrganizationResponse } from "@/types/organization";
import { User } from "@/types/user";
import { isValidOrganization } from "@/utils/organization.utils";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

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
  } catch (error) {
    console.error("Error en generateMetadata:", error);
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

  try {
    const response = await httpInternalApi.httpGetPublic<OrganizationResponse>(
      "/organizations",
      new URLSearchParams({ slug })
    );
    initialData = response.organization;
  } catch (error) {
    console.error("Error al cargar la organización:", error);
  }

  if (auth_token) {
    try {
      const response = await httpInternalApi.httpGetPublic<User>("/auth/me");
      userData = response;
    } catch (error) {
      console.error("Error al cargar el usuario:", error);
    }
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-white text-black dark:bg-gray-900 dark:text-white transition-colors`}
      >
        <ThemeProvider>
          <OrganizationProvider initialData={initialData} slug={slug}>
            <UserProvider userData={userData}>
              <div className="w-full flex min-h-screen">
                {auth_token &&
                  !isLoginPage &&
                  isValidOrganization(initialData) && (
                    <SidebarContainer token={auth_token} />
                  )}
                <div className="w-full transition-all duration-300 flex-grow">
                  <main className="w-full flex-grow">{children}</main>
                </div>
              </div>
              <ToasterProvider />
            </UserProvider>
          </OrganizationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

