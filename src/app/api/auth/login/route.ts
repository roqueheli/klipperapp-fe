import authAPI from "@/lib/auth/auth.service";
import { AccesDeniedError } from "@/lib/common/http.errors";
import LoginScheme from "@/schemes/login.scheme";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { email, password } = await LoginScheme.validate(await request.json());

    try {
        const loginResponse = await authAPI.login(email, password);
        const expiresAt = new Date(Date.now() + (8 * 60 * 60 * 1000));

        const response = NextResponse.json({ status: 200, loginResponse });

        response.headers.set(
            'Set-Cookie',
            `${process.env.AUTH_TOKEN_SECRET}=${loginResponse.token}; Expires=${expiresAt.toUTCString()}; HttpOnly; Secure; SameSite=None; Path=/`
        );

        return response;
    } catch (error) {
        if (error instanceof AccesDeniedError) {
            return new Response(JSON.stringify({ error: "Access Denied" }), { status: 403 });
        } else {
            return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
        }
    }
}

