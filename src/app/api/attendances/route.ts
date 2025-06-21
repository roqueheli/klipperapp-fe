import attendancessAPI from "@/lib/attendances/attendances.service";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const cookiesStore = cookies();
    const token = (await cookiesStore).get(process.env.AUTH_TOKEN_SECRET || '');
    const searchParams = request.nextUrl.searchParams;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const response = await attendancessAPI.getAttendances(searchParams, token?.value);

        if (response.length === 0) {
            throw new Error('Attendances not found');
        }

        return NextResponse.json({
            attendances: response,
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Attendances get failure " + error, status: 404 }));
    }
}

export async function POST(request: NextRequest) {
    const cookiesStore = cookies();
    const token = (await cookiesStore).get(process.env.AUTH_TOKEN_SECRET || '');
    const body = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await attendancessAPI.createAttendance(body, token?.value || "");

        if (!data.id) throw new Error('Creation attendance failure');

        return NextResponse.json({ profile: data, status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to create an attendance " + error, status: 404 }));
    }
}

export async function PUT(request: NextRequest) {
    const cookiesStore = cookies();
    const token = (await cookiesStore).get(process.env.AUTH_TOKEN_SECRET || '');
    const body = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await attendancessAPI.updateAttendance(body, token?.value || "");

        if (!data.id) throw new Error('Creation attendance failure');

        return NextResponse.json({ profile: data, status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to create an attendance " + error, status: 404 }));
    }
}
