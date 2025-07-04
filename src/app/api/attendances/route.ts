import attendancessAPI from "@/lib/attendances/attendances.service";
import { getToken } from "@/lib/utils/auth.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const token = await getToken();
    const searchParams = request.nextUrl.searchParams;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const response = await attendancessAPI.getAttendances(searchParams, token);

        if (response.length === 0) {
            throw new Error('Attendances not found');
        }

        return NextResponse.json({
            attendances: response,
            status: 200,
        });
    } catch {
        return new Response(JSON.stringify({ error: "Attendances get failure"}));
    }
}

export async function POST(request: NextRequest) {
    const token = await getToken();
    const body = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await attendancessAPI.createAttendance(body, token);

        if (!data.id) throw new Error('Creation attendance failure');

        return NextResponse.json({ profile: data, status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to create an attendance " + error, status: 404 }));
    }
}

export async function PUT(request: NextRequest) {
    const token = await getToken();
    const body = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await attendancessAPI.updateAttendance(body, token);

        if (!data.id) throw new Error('Creation attendance failure');

        return NextResponse.json({ profile: data, status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to create an attendance " + error, status: 404 }));
    }
}
