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

export async function PUT(request: NextRequest) {
    const cookiesStore = cookies();
    const token = (await cookiesStore).get(process.env.AUTH_TOKEN_SECRET || '');
    const body = await request.json();

    console.log("body", body);
    

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await usersAPI.updateUser(body, token?.value || "");

        if (!data.id) throw new Error('Failed user update');

        return NextResponse.json({ profile: data, status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "User update failure " + error, status: 404 }));
    }
}

export async function DELETE(request: NextRequest) {
    const cookiesStore = cookies();
    const token = (await cookiesStore).get(process.env.AUTH_TOKEN_SECRET || '');
    const body = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await usersAPI.deleteUser(body, token?.value || "");

        if (!data.id) throw new Error('Failed user delete');

        return NextResponse.json({ profile: data, status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "User delete failure " + error, status: 404 }));
    }
}

