import usersAPI from "@/lib/users/users.service";
import { getToken } from "@/lib/utils/auth.utils";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
    const token = await getToken();
    const body = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const payments = await usersAPI.setAvailable(body, token);

        if (!payments) {
            throw new Error('Status not changed');
        }

        return NextResponse.json(payments);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Status change failure " + error, status: 404 }));
    }
}
