import { NextRequest, NextResponse } from "next/server";
import httpInternalApi from "./lib/common/http.internal.service";
import { Organization } from "./types/organization";
import { isValidOrganization } from "./utils/organization.utils";


// Definir rutas que requieren autenticación y rutas públicas
const protectedRoutes = ["dashboard"];
const publicRoutes = ["login", "register"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Obtener el slug y la ruta secundaria (lo que viene después del slug)
    const match = pathname.match(/^\/([^\/]+)(?:\/([^\/]+))?/);
    if (!match) return NextResponse.next();

    const slug = match[1];
    const section = match[2]; // puede ser undefined

    const token = request.cookies.get(process.env.AUTH_TOKEN_SECRET || "")?.value;

    // Validar si la organización existe
    const organization = await httpInternalApi.httpGetPublic<Organization>(
        "/organization",
        new URLSearchParams({ slug })
    );

    if (!isValidOrganization(organization)) {
        // Si la organización no es válida, redirigir al base slug
        // const baseSlugUrl = new URL(`/${slug}`, request.url);
        // return NextResponse.redirect(baseSlugUrl);
    }
    // Redirecciones según autenticación
    if (!token && section && protectedRoutes.includes(section)) {
        // Usuario no autenticado intentando acceder a ruta protegida
        return NextResponse.redirect(new URL(`/${slug}/auth/login`, request.url));
    }

    if (token && section && publicRoutes.includes(section)) {
        // Usuario autenticado intentando acceder a ruta pública
        return NextResponse.redirect(new URL(`/${slug}/user`, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/:slug/auth/:path*",
        "/:slug/user/:path*",
    ],
};
