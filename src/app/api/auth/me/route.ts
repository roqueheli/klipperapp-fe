import authAPI from "@/lib/auth/auth.service";
import { getToken } from "@/lib/utils/auth.utils";
import { NextResponse } from "next/server";

export async function GET() {
    const token = await getToken();

    if (!token) return NextResponse.json({ error: "Unauthorized token" }, { status: 401 });

    try {
        const user = await authAPI.me(token);
        return NextResponse.json(user);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Unauthorized auth/me" + error, status: 401 }));
    }
}
