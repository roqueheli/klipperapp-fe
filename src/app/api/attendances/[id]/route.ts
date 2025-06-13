import attendancessAPI from "@/lib/attendances/attendances.service";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const cookiesStore = cookies();
    const token = (await cookiesStore).get(process.env.AUTH_TOKEN_SECRET || '');
    const searchParams = request.nextUrl.searchParams;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const response = await attendancessAPI.getAttendanceById(searchParams, token?.value);

        return NextResponse.json({
            attendances: response,
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Ticket not found", status: 404 }));
    }
}