import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const header = headers();
        const authorization = (await header).get('Authorization');
        const token = authorization?.replace("Bearer ", "") || '';

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const response = NextResponse.json({ message: "Logged out successfully", status: 200 });

        response.cookies.set(process.env.AUTH_TOKEN_SECRET || '', '', {
            expires: new Date(0), // Fecha en el pasado
            httpOnly: true,
            secure: true,
            domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : 'localhost',
            path: '/',
            sameSite: 'lax'
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" + error },
            { status: 500 }
        );
    }
}
