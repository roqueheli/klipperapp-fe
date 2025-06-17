import authAPI from "@/lib/auth/auth.service";
import { AccesDeniedError } from "@/lib/common/http.errors";
import RegisterScheme from "@/schemes/register.scheme";
import { RegisterData } from "@/types/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await RegisterScheme.validate(await request.json());
    try {
        const registerResponse = await authAPI.register(body as RegisterData);
        // const expiresAt = Date.now() + ((Number(process.env.NEXT_AUTH_TOKEN_EXP) || 8 * 60 * 60) * 1000);

        const response = NextResponse.json(registerResponse, {
            status: 200,
        });

        // request.cookies.set(`${process.env.AUTH_TOKEN_SECRET}`, registerResponse.data.token, {
        //     httpOnly: true,
        //     secure: true,
        //     path: '/',
        //     domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : 'localhost',
        //     expires: expiresAt,
        //     sameSite: 'lax'
        // });

        return response;
    } catch (error) {
        if (error instanceof AccesDeniedError) {
            return new Response(JSON.stringify({ error: "Access Denied " + error }), { status: 403 });
        } else {
            return new Response(JSON.stringify({ error: "Internal server error " + error }), { status: 500 });
        }
    }
}