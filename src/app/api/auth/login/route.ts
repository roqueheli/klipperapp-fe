import authAPI from "@/lib/auth/auth.service";
import { AccesDeniedError } from "@/lib/common/http.errors";
import LoginScheme from "@/schemes/login.scheme";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { email, password } = await LoginScheme.validate(await request.json());

    try {
        const expiresInSeconds = ((Number(process.env.NEXT_AUTH_TOKEN_EXP) || 8 * 60 * 60) * 1000);
        const cookieName = "auth_token";
        const isProd = process.env.NODE_ENV === "production";
        const loginResponse = await authAPI.login(email, password);

        const response = NextResponse.json({ status: 200, token: loginResponse.token });

        response.cookies.set({
            name: cookieName,
            value: loginResponse.token,
            httpOnly: true,
            sameSite: isProd ? "none" : "lax",
            secure: isProd,
            path: "/",
            maxAge: expiresInSeconds,
        });

        return response;
    } catch (error) {
        if (error instanceof AccesDeniedError) {
            return new Response(JSON.stringify({ error: "Access Denied" }), { status: 403 });
        } else {
            return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
        }
    }
}
