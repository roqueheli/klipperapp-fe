import authAPI from "@/lib/auth/auth.service";
import { AccesDeniedError } from "@/lib/common/http.errors";
import RegisterScheme, { RegisterData } from "@/schemes/register.scheme";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body: RegisterData = await RegisterScheme.validate(await request.json());
    try {
        const registerResponse = await authAPI.register(body);
        const expiresAt = Date.now() + ((Number(process.env.NEXT_AUTH_TOKEN_EXP) || 8 * 60 * 60) * 1000);

        (await cookies()).set(`${process.env.AUTH_TOKEN_SECRET}`, registerResponse.data.token, {
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
            return new Response(JSON.stringify({ error: "Access Denied " + error }), { status: 403 });
        } else {
            return new Response(JSON.stringify({ error: "Internal server error " + error }), { status: 500 });
        }
    }
}