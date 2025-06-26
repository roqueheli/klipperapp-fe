import checkinAPI from "@/lib/checkin/checkin.service";
import { getToken } from "@/lib/utils/auth.utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const token = await getToken();
    const body = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await checkinAPI.resume_attendance(body, token);

        if (!data.id) throw new Error('Start day failure');

        return NextResponse.json({ profile: data, status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Error starting day failed " + error, status: 404 }));
    }
}