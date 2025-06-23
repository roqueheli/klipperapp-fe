import authAPI from "@/lib/auth/auth.service";
import { AccesDeniedError } from "@/lib/common/http.errors";
import LoginScheme from "@/schemes/login.scheme";
import { NextRequest, NextResponse } from "next/server";

/**
 * Login endpoint.
 *
 * Requires a JSON body with the `email` and `password` properties.
 *
 * If the login is successful, it sets a cookie with the token and returns a JSON response with a 200 status.
 * If the login fails, it returns a JSON response with a 403 status and an error message.
 * If there is an internal error, it returns a JSON response with a 500 status and an error message.
 */
export async function POST(request: NextRequest) {
    const { email, password } = await LoginScheme.validate(await request.json());

    try {
        const loginResponse = await authAPI.login(email, password);
        const expiresAt = new Date(Date.now() + ((Number(process.env.NEXT_AUTH_TOKEN_EXP) || 8 * 60 * 60) * 1000));
        const response = NextResponse.json({ status: 200, loginResponse });

        const isProd = process.env.NODE_ENV === "production";
        const cookieName = process.env.AUTH_TOKEN_SECRET;
        const domain = isProd ? "Domain=.klipperapp-fe.vercel.app;" : "Domain=localhost";
        const secureFlag = isProd ? "Secure; " : "";

        response.headers.set('Set-Cookie', `${cookieName}=${loginResponse.token}; Expires=${expiresAt.toUTCString()}; HttpOnly; ${secureFlag} SameSite=None; Path=/; ${domain}`);

        return response;
    } catch (error) {
        if (error instanceof AccesDeniedError) {
            return new Response(JSON.stringify({ error: "Access Denied" }), { status: 403 });
        } else {
            return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
        }
    }
}

