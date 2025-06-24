import attendancessAPI from "@/lib/attendances/attendances.service";
import { getToken } from "@/lib/utils/auth.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const token = await getToken();
    const searchParams = request.nextUrl.searchParams;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const response = await attendancessAPI.getTodayAttendances(searchParams, token);

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

