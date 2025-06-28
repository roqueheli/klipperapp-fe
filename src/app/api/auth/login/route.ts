import authAPI from "@/lib/auth/auth.service";
import { AccesDeniedError } from "@/lib/common/http.errors";
import LoginScheme from "@/schemes/login.scheme";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Validar body
        const { email, password } = await LoginScheme.validate(await request.json());
        const isProd = process.env.NODE_ENV === "production";
        
        // Login contra backend
        const loginResponse = await authAPI.login(email, password);
        const token = loginResponse.token;

        // Configuración cookie
        const expiresInSeconds = (Number(process.env.NEXT_AUTH_TOKEN_EXP) || 8 * 60 * 60) * 1000;
        const cookieName = process.env.AUTH_TOKEN_SECRET || "auth_token";
        const response = NextResponse.json({ success: true });

        response.cookies.set({
            name: cookieName,
            value: token,
            httpOnly: true,
            sameSite: isProd ? "none" : "lax",
            secure: isProd, // Safari requiere secure=true para SameSite=None
            path: "/",
            maxAge: expiresInSeconds,
            domain: isProd ? process.env.NEXT_PUBLIC_DOMAIN : undefined,
        });

        return response;
    } catch (error) {
        if (error instanceof AccesDeniedError) {
            return NextResponse.json({ error: "Access Denied" }, { status: 403 });
        }

        console.error("Error interno de login:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

