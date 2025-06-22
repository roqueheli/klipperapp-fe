import usersAPI from "@/lib/users/users.service";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const cookiesStore = cookies();
    const token = (await cookiesStore).get(process.env.AUTH_TOKEN_SECRET || '');
    const searchParams = request.nextUrl.searchParams;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const users = await usersAPI.getUsers(searchParams, token?.value || "");

        if (!users) {
            throw new Error('User not found');
        }

        return NextResponse.json({
            users,
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "User not found " + error, status: 404 }));
    }
}

export async function POST(request: NextRequest) {
    const cookiesStore = cookies();
    const token = (await cookiesStore).get(process.env.AUTH_TOKEN_SECRET || '');
    const body = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await usersAPI.createUser(body, token?.value || "");

        if (!data.id) throw new Error('Failed user create');

        return NextResponse.json({ profile: data, status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "User create failure " + error, status: 404 }));
    }
}