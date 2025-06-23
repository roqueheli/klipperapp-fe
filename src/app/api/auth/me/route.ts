import authAPI from "@/lib/auth/auth.service";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const token = (await headers()).get('Authorization')?.replace("Bearer ", "") || (await cookies()).get(process.env.AUTH_TOKEN_SECRET || "");

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const user = await authAPI.me(typeof token === 'string' ? token : token.value);
        return NextResponse.json(user);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Unauthorized " + error, status: 401 }));
    }
}
