import { NextRequest, NextResponse } from "next/server";
import httpInternalApi from "./lib/common/http.internal.service";
import { Organization } from "./types/organization";
import { isValidOrganization } from "./utils/organization.utils";

const protectedRoutes = ["dashboard", "users", "profiles", "attendances", "services", "transactions", "expenses", "management", "payments", "change-password"];
const publicRoutes = ["login", "register", "forgot-password"];

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
    
    const needsAuth =
        pathname === `/${slug}/auth/change-password` ||
        (!token && section && protectedRoutes.includes(section));

    if (!token && needsAuth) {
        return NextResponse.redirect(new URL(`/${slug}/auth/login`, request.url));
    }

    if ((!token && pathname === `/${slug}`) || (!token && section && protectedRoutes.includes(section))) {
        return NextResponse.redirect(new URL(`/${slug}/auth/login`, request.url));
    }

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

    // ❌ Si NO existe la organización, dejarlo pasar (para que la página lo maneje)
    if (!organizationExists) return NextResponse.next();

    if (!token && request.nextUrl.pathname.includes("/users/checkin")) {
        return NextResponse.redirect(
            new URL(`${slug}/auth/login?redirect=${request.nextUrl.pathname}`, request.url)
        );
    }

    if (token && pathname === `/${slug}` && !isAuthRoute) {
        return NextResponse.redirect(new URL(`/${slug}/users`, request.url));
    }

    if (token && section && publicRoutes.includes(section)) {
        return NextResponse.redirect(new URL(`/${slug}/users`, request.url));
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
        "/:slug/transactions/:path*",
        "/:slug/management/:path*",
        "/:slug/expenses/:path*",
        "/:slug/payments/:path*",
    ],
};
