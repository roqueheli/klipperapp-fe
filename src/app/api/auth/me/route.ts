import authAPI from "@/lib/auth/auth.service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const cookiesStore = cookies();
    const token = (await cookiesStore).get(process.env.AUTH_TOKEN_SECRET || '');

    if (!token?.value) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await authAPI.me(token?.value);
        return NextResponse.json(user);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Unauthorized " + error, status: 401 }));
    }
}