export const dynamic = "force-dynamic";

import NavBarContainer from "@/components/navbar/NavBar.Container";
import ThemeProvider from "@/components/ThemeProvider";
import ToasterProvider from "@/components/ui/ToasterProvider";
import { OrganizationProvider } from "@/contexts/OrganizationContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Organization } from "@/types/organization";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../styles/globals.css";
import { isValidOrganization } from "@/utils/organization.utils";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const organization = await httpInternalApi.httpGetPublic<Organization>("/organization", new URLSearchParams({ slug }));

  return {
    title: organization?.name || "KlipperApp",
    description:
      organization?.description || "Sistema de gestión para barberías",
    icons: {
      icon: organization?.favicon || "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const { slug } = await params;
  const initialData = await httpInternalApi.httpGetPublic<Organization>("/organization", new URLSearchParams({ slug }));


  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-white text-black dark:bg-gray-900 dark:text-white transition-colors`}
      >
        <ThemeProvider>
          <OrganizationProvider initialData={initialData} slug={slug}>
            {isValidOrganization(initialData) && <NavBarContainer />}
            <NavBarContainer />
            {children}
            <ToasterProvider />
          </OrganizationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
