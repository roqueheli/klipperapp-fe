import profilesAPI from "@/lib/profiles/profiles.service";
import { getToken } from "@/lib/utils/auth.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const token = await getToken();
    const searchParams = request.nextUrl.searchParams;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await profilesAPI.getProfile(searchParams, token);

        if (!data.profile?.id) throw new Error('Customer not found');

        return NextResponse.json({ profile: data, status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Customer not found " + error, status: 404 }));
    }
}
