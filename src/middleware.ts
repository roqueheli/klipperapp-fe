import { NextRequest, NextResponse } from "next/server";
import httpInternalApi from "./lib/common/http.internal.service";
import { Organization } from "./types/organization";
import { isValidOrganization } from "./utils/organization.utils";

const protectedRoutes = ["dashboard", "users", "profiles", "attendances", "services"];
const publicRoutes = ["login", "register"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(process.env.AUTH_TOKEN_SECRET || "")?.value;

    // Ignorar archivos estáticos (.ico, .png, etc.)
    const isStaticFile = /\.(ico|png|jpg|jpeg|svg|webp|css|js|txt)$/.test(pathname);
    if (isStaticFile) return NextResponse.next();

    if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    const match = pathname.match(/^\/([^\/]+)(?:\/([^\/]+))?/);
    if (!match) return NextResponse.next();

    const slug = match[1];
    const section = match[2]; // Puede ser undefined

    const isAuthRoute = pathname.startsWith(`/${slug}/auth`);

    // 👇 Validar si la organización existe
    let organizationExists = false;
    try {
        const response = await httpInternalApi.httpGetPublic<Organization>("/organizations", new URLSearchParams({ slug }));

        if (isValidOrganization(response)) {
            organizationExists = true;
        }
    } catch (error) {
        console.error("Middleware: Organization validation error", error);
    }

    if (!token && protectedRoutes.includes(section)) {
        return NextResponse.redirect(new URL(`/${slug}/auth/login`, request.url));
    }

    // ❌ Si NO existe la organización, dejarlo pasar (para que la página lo maneje)
    if (!organizationExists) return NextResponse.next();

    if (token && pathname === `/${slug}` && !isAuthRoute) {
        return NextResponse.redirect(new URL(`/${slug}/users`, request.url));
    }

    if (!token && pathname === `/${slug}` && !isAuthRoute) {
        return NextResponse.redirect(new URL(`/${slug}/auth/login`, request.url));
    }

    if (!token && section && protectedRoutes.includes(section)) {
        return NextResponse.redirect(new URL(`/${slug}/auth/login`, request.url));
    }

    if (token && section && publicRoutes.includes(section)) {
        return NextResponse.redirect(new URL(`/${slug}/user`, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/:slug",
        "/:slug/auth/:path*",
        "/:slug/users/:path*",
        "/:slug/profiles/:path*",
        "/:slug/attendances/:path*",
        "/:slug/services/:path*",
    ],
};
