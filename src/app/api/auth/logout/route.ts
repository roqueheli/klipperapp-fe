import { getToken } from "@/lib/utils/auth.utils";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const token = await getToken();

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const response = NextResponse.json({ message: "Logged out successfully", status: 200 });

        response.cookies.delete("auth_token");

        return response;
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" + error },
            { status: 500 }
        );
    }
}
