import { NextRequest, NextResponse } from "next/server";
import httpInternalApi from "./lib/common/http.internal.service";
import { Organization } from "./types/organization";
import { isValidOrganization } from "./utils/organization.utils";

const protectedRoutes = ["dashboard"];
const publicRoutes = ["login", "register"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ⛔ Ignorar archivos estáticos (favicon, .png, .css, etc.)
    const isStaticFile = /\.(.*)$/.test(pathname);
    if (isStaticFile) return NextResponse.next();

    // ⛔ Ignorar APIs (opcional, si tenés /api)
    if (pathname.startsWith("/api")) return NextResponse.next();

    const match = pathname.match(/^\/([^\/]+)(?:\/([^\/]+))?/);
    if (!match) return NextResponse.next();

    const slug = match[1];
    const section = match[2]; // puede ser undefined

    const token = request.cookies.get(process.env.AUTH_TOKEN_SECRET || "")?.value;

    const organization = await httpInternalApi.httpGetPublic<Organization>(
        "/organizations/slug",
        slug
    );

    if (!isValidOrganization(organization)) {
        const baseSlugUrl = new URL(`/${slug}`, request.url);
        return NextResponse.redirect(baseSlugUrl);
    }

    const isAuthRoute = pathname.startsWith(`/${slug}/auth`);

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
        "/:slug/user/:path*",
    ],
};
