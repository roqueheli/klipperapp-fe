import { NextRequest, NextResponse } from "next/server";
import httpInternalApi from "./lib/common/http.internal.service";
import { Organization } from "./types/organization";
import { isValidOrganization } from "./utils/organization.utils";

const protectedRoutes = ["dashboard", "users", "profiles", "attendances", "services", "transactions", "expenses", "management", "payments"];
const publicRoutes = ["login", "register"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(process.env.AUTH_TOKEN_SECRET || "")?.value;

    // Crear la respuesta base
    const response = NextResponse.next();

    // 🔒 Configuración de seguridad mejorada para Heroku
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src 'none'");

    // Ignorar archivos estáticos
    const isStaticFile = /\.(ico|png|jpg|jpeg|svg|webp|css|js|txt|woff2?)$/.test(pathname);
    if (isStaticFile) return response;

    // Ignorar rutas internas de Next.js
    if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
        return response;
    }

    const match = pathname.match(/^\/([^\/]+)(?:\/([^\/]+))?/);
    if (!match) return response;

    const slug = match[1];
    const section = match[2];
    const isAuthRoute = pathname.startsWith(`/${slug}/auth`);

    // Redirecciones para usuarios no autenticados
    if ((!token && pathname === `/${slug}`) || (!token && section && protectedRoutes.includes(section))) {
        const redirectResponse = NextResponse.redirect(new URL(`/${slug}/auth/login`, request.url));
        // Aplicar las mismas cabeceras de seguridad
        securityHeaders.forEach(([header, value]) => {
            redirectResponse.headers.set(header, value);
        });
        return redirectResponse;
    }

    // Validar organización
    let organizationExists = false;
    try {
        const orgResponse = await httpInternalApi.httpGetPublic<Organization>(
            "/organizations",
            new URLSearchParams({ slug })
        );
        organizationExists = isValidOrganization(orgResponse);
    } catch (error) {
        console.error("Middleware: Organization validation error", error);
    }

    if (!organizationExists) return response;

    // Redirecciones especiales
    if (!token && pathname.includes("/users/checkin")) {
        const redirectResponse = NextResponse.redirect(
            new URL(`${slug}/auth/login?redirect=${encodeURIComponent(request.nextUrl.pathname)}`, request.url)
        );
        securityHeaders.forEach(([header, value]) => {
            redirectResponse.headers.set(header, value);
        });
        return redirectResponse;
    }

    if (token && pathname === `/${slug}` && !isAuthRoute) {
        const redirectResponse = NextResponse.redirect(new URL(`/${slug}/users`, request.url));
        securityHeaders.forEach(([header, value]) => {
            redirectResponse.headers.set(header, value);
        });
        return redirectResponse;
    }

    if (token && section && publicRoutes.includes(section)) {
        const redirectResponse = NextResponse.redirect(new URL(`/${slug}/users`, request.url));
        securityHeaders.forEach(([header, value]) => {
            redirectResponse.headers.set(header, value);
        });
        return redirectResponse;
    }

    return response;
}

// Configuración de seguridad reutilizable
const securityHeaders = [
    ['X-Content-Type-Options', 'nosniff'],
    ['X-Frame-Options', 'DENY'],
    ['X-XSS-Protection', '1; mode=block'],
    ['Referrer-Policy', 'strict-origin-when-cross-origin'],
    ['Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload'],
    ['Permissions-Policy', 'geolocation=(), microphone=(), camera=()'],
    ['Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src 'none'"]
];

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