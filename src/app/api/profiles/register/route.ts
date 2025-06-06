import profilesAPI from "@/lib/profiles/profiles.service";
import RegisterScheme from "@/schemes/register.scheme";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const cookiesStore = cookies();
    const token = (await cookiesStore).get(process.env.AUTH_TOKEN_SECRET || '');
    const { name, email, phone_number, birth_date, organization_id } = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await profilesAPI.registerProfile({ name, email, phone_number, birth_date, organization_id }, token?.value || "");

        if (!data.id) throw new Error('Register failed');

        return NextResponse.json({ profile: data, status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to register a new profile", status: 404 }));
    }
}
