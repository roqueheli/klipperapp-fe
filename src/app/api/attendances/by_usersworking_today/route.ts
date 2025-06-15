import attendancessAPI from "@/lib/attendances/attendances.service";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const cookiesStore = cookies();
    const token = (await cookiesStore).get(process.env.AUTH_TOKEN_SECRET || '');
    const searchParams = request.nextUrl.searchParams;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const response = await attendancessAPI.getAttendancesByUserWorking(searchParams, token?.value);

        return NextResponse.json(response);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Users attendances get failure", status: 404 }));
    }
}