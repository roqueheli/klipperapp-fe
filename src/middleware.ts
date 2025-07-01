import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import httpInternalApi from "./lib/common/http.internal.service";
import { User } from "./types/user";

const protectedRoutes = [
    "dashboard", "users", "profiles", "attendances", "services",
    "transactions", "expenses", "management", "payments",
    "change-password", "restore-password",
];

const publicRoutes = ["login", "register", "forgot-password"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = (await cookies()).get("auth_token")?.value || null;

    // Ignorar archivos estáticos y rutas internas
    if (/\.(ico|png|jpg|jpeg|svg|webp|css|js|txt)$/.test(pathname) ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    // Obtener slug y sección
    const match = pathname.match(/^\/([^\/]+)(?:\/([^\/]+))?/);
    if (!match) return NextResponse.next();

    const slug = match[1];
    const section = match[2];

    // Determinar tipo de ruta
    const isProtectedRoute = section && protectedRoutes.includes(section);
    const isPublicRoute = section && publicRoutes.includes(section);
    const isAuthRoute = pathname.startsWith(`/${slug}/auth`);

    // 1. Redirigir a login si no hay token y es ruta protegida
    if (!token && isProtectedRoute) {
        const loginUrl = new URL(`/${slug}/auth/login`, request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 2. Redirigir a dashboard si hay token y es ruta pública
    if (token && isPublicRoute) return NextResponse.redirect(new URL(`/${slug}/users`, request.url));

    // 3. Validar usuario si hay token y es ruta protegida
    if (token && isProtectedRoute) {
        try {
            const user = await httpInternalApi.httpGet<User>("/auth/me", undefined, token);

            if (!user?.active) {
                const logoutUrl = new URL(`/${slug}/auth/login`, request.url);
                logoutUrl.searchParams.set("logout", "1");
                return NextResponse.redirect(logoutUrl);
            }

            if (user.email_verified === false) {
                return NextResponse.redirect(new URL(`/${slug}/auth/restore-password`, request.url));
            }
        } catch (err) {
            const logoutUrl = new URL(`/${slug}/auth/login`, request.url);
            logoutUrl.searchParams.set("logout", "1");
            return NextResponse.redirect(logoutUrl);
        }
    }

    // 4. Redirigir a dashboard si está en raíz del slug
    if (token && pathname === `/${slug}` && !isAuthRoute) return NextResponse.redirect(new URL(`/${slug}/users`, request.url));

    return NextResponse.next();
}
