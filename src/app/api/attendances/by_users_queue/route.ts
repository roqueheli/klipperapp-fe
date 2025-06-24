import attendancessAPI from "@/lib/attendances/attendances.service";
import { getToken } from "@/lib/utils/auth.utils";
import { NextResponse } from "next/server";

export async function GET() {
    const token = await getToken();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const response = await attendancessAPI.getUsersQueue(token);

        return NextResponse.json(response);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Users attendances get failure: " + error, status: 404 }));
    }
}