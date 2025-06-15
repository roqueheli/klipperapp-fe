export const dynamic = "force-dynamic";

import Footer from "@/components/footer/Footer";
import NavBarContainer from "@/components/navbar/NavBar.Container";
import ThemeProvider from "@/components/ThemeProvider";
import ToasterProvider from "@/components/ui/ToasterProvider";
import { OrganizationProvider } from "@/contexts/OrganizationContext";
import { UserProvider } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Organization, OrganizationResponse } from "@/types/organization";
import { User } from "@/types/user";
import { isValidOrganization } from "@/utils/organization.utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies, headers } from "next/headers";
import "../../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    let organization: Organization | null = null;
    try {
      const response =
        await httpInternalApi.httpGetPublic<OrganizationResponse>(
          "/organizations",
          new URLSearchParams({ slug })
        );
      organization = response.organization;
    } catch (error) {
      console.error("Error loading organization: " + error);
    }

    return {
      title: organization?.name || "KlipperApp",
      description: organization?.bio || "Sistema de gestión para barberías",
      icons: {
        icon: organization?.metadata?.media_configs?.favicon || "/favicon.ico",
      },
    };
  } catch (error) {
    console.log(error);
    return {
      title: "KlipperApp",
      description: "Sistema de gestión para barberías",
      icons: {
        icon: "/favicon.ico",
      },
    };
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const { slug } = await params;

  const pathname = (await headers()).get("x-next-pathname") || ""; // 👈 Detectar ruta actual
  const isLoginPage = pathname.includes("/auth/login"); // 👈 Ajusta si tu path cambia
  const cookiesStore = cookies();
  const auth_token = (await cookiesStore).get(
    process.env.AUTH_TOKEN_SECRET || ""
  );

  let initialData: Organization | null = null;
  let userData: User | null = null;

  try {
    const response = await httpInternalApi.httpGetPublic<OrganizationResponse>(
      "/organizations",
      new URLSearchParams({ slug })
    );
    initialData = response.organization;
  } catch (error) {
    console.error("Error loading organization: " + error);
  }

  if (auth_token) {
    try {
      const response = await httpInternalApi.httpGetPublic<User>("/auth/me");
      userData = response;
    } catch (error) {
      console.error("Error loading user data: " + error);
    }
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.className} flex flex-col min-h-screen justify-center items-center bg-white text-black dark:bg-gray-900 dark:text-white transition-colors`}
      >
        <ThemeProvider>
          <OrganizationProvider initialData={initialData} slug={slug}>
            <UserProvider userData={userData}>
              {!isLoginPage && isValidOrganization(initialData) && (
                <NavBarContainer />
              )}
              <main className="flex-grow flex items-center justify-center w-full">
                {children}
              </main>
              <Footer />
              <ToasterProvider />
            </UserProvider>
          </OrganizationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
