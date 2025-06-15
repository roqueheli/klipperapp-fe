import authAPI from "@/lib/auth/auth.service";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const header = headers();
        const authorization = (await header).get('Authorization');
        const token = authorization?.replace("Bearer ", "") || '';

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        (await cookieStore).set(process.env.AUTH_TOKEN_SECRET || '', '', {
            expires: new Date(0), // Fecha en el pasado
            httpOnly: true,
            secure: true,
            domain: 'localhost',
            path: '/'
        });

        return NextResponse.json({
            message: "Logged out successfully",
            status: 200,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" + error },
            { status: 500 }
        );
    }
}
