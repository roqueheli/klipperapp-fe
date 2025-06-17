
import authAPI from "@/lib/auth/auth.service";
import { AccesDeniedError } from "@/lib/common/http.errors";
import LoginScheme from "@/schemes/login.scheme";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { email, password } = await LoginScheme.validate(await request.json());
    
    try {
        const loginResponse = await authAPI.login(email, password);        
        const expiresAt = Date.now() + ((Number(process.env.NEXT_AUTH_TOKEN_EXP) || 8 * 60 * 60) * 1000);

        (await cookies()).set(`${process.env.AUTH_TOKEN_SECRET}`, loginResponse.token, {
            expires: expiresAt,
            httpOnly: true,
            secure: true,
            domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : 'localhost',
            path: '/'
        });

        return NextResponse.json({
            loginResponse,
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
