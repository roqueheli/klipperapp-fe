import attendancessAPI from "@/lib/attendances/attendances.service";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const cookiesStore = cookies();
    const token = (await cookiesStore).get(process.env.AUTH_TOKEN_SECRET || '');

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const response = await attendancessAPI.getAttendances(token?.value);

        if (response.attendances.length === 0) {
            throw new Error('Attendances not found');
        }

        return NextResponse.json({
            attendances: response.attendances,
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Ticket not found", status: 404 }));
    }
}


export async function POST(request: NextRequest) {
    const cookiesStore = cookies();
    const token = (await cookiesStore).get(process.env.AUTH_TOKEN_SECRET || '');
    const { profile_id, organization_id, branch_id, service_id, attended_by } = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await attendancessAPI.createAttendance({ profile_id, organization_id, branch_id, service_id, attended_by }, token?.value || "");

        if (!data.id) throw new Error('Creation attendance failure');

        return NextResponse.json({ profile: data, status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to create an attendance", status: 404 }));
    }
}
