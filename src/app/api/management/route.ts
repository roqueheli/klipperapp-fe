import usersAPI from "@/lib/users/users.service";
import { getToken } from "@/lib/utils/auth.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const token = await getToken();
    const searchParams = request.nextUrl.searchParams;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const payments = await usersAPI.calculatePayments(searchParams, token);

        if (!payments) {
            throw new Error('Calc not found');
        }

        return NextResponse.json(payments);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Calculation failure: " + error, status: 404 }));
    }
}
