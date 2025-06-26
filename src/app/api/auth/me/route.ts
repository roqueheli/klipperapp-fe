import authAPI from "@/lib/auth/auth.service";
import { getToken } from "@/lib/utils/auth.utils";
import { NextResponse } from "next/server";

export async function GET() {
    const token = await getToken();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const user = await authAPI.me(token);
        return NextResponse.json(user);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Unauthorized " + error, status: 401 }));
    }
}
