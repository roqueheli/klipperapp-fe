import rolesAPI from "@/lib/roles/roles.service";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const cookiesStore = cookies();
    const token = (await cookiesStore).get(process.env.AUTH_TOKEN_SECRET || '');
    const searchParams = request.nextUrl.searchParams;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const roles = await rolesAPI.getRoles(searchParams, token?.value || "");

        if (!roles) {
            throw new Error('Roles not found');
        }

        return NextResponse.json({
            roles,
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Roles failure " + error, status: 404 }));
    }
}