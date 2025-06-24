import profilesAPI from "@/lib/profiles/profiles.service";
import { getToken } from "@/lib/utils/auth.utils";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const token = await getToken();
    const body = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await profilesAPI.registerProfile(body, token);

        if (!data.id) throw new Error('Register failed');

        return NextResponse.json({ profile: data, status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to register a new profile " + error, status: 404 }));
    }
}
