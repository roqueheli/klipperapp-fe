import attendancessAPI from "@/lib/attendances/attendances.service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookiesStore = cookies();
    const token = (await cookiesStore).get(process.env.AUTH_TOKEN_SECRET || '');

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const response = await attendancessAPI.getUsersQueue(token?.value);

        return NextResponse.json(response);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Users attendances get failure: " + error, status: 404 }));
    }
}