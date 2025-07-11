import checkinAPI from "@/lib/checkin/checkin.service";
import { getToken } from "@/lib/utils/auth.utils";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
    const token = await getToken();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await checkinAPI.reopenAttendance(Number(request.nextUrl?.pathname?.split('/').pop()), token);

        if (!data) throw new Error('Reopen attendance failed');

        return NextResponse.json(data);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Error reopen attendance failure " + error, status: 404 }));
    }
}