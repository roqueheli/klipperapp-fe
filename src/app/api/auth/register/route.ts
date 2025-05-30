import RegisterScheme from "@/schemes/register.scheme";
import authAPI from "@/services/auth/auth.service";
import { AccesDeniedError } from "@/services/common/http.errors";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { email, password, first_name, last_name, phone, birth_date } = await RegisterScheme.validate(await request.json());
    try {
        const registerResponse = await authAPI.register({ email, password, first_name, last_name, phone, birth_date });
        const expiresAt = Date.now() + (Number(process.env.AUTH_TOKEN_EXP) || 60 * 60) * 1000;

        (await cookies()).set(`${process.env.AUTH_TOKEN_SECRET}`, registerResponse.data.access_token, {
            expires: expiresAt,
            httpOnly: true,
            secure: true,
            domain: 'localhost',
            path: '/'
        });

        return NextResponse.json(registerResponse, {
            status: 200,
        });
    } catch (error) {
        if (error instanceof AccesDeniedError) {
            return new Response(JSON.stringify({ error: "Access Denied" }), { status: 403 });
        } else {
            return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
        }
    }
}