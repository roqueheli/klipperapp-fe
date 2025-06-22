import branchesAPI from "@/lib/branches/branches.service";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    const cookiesStore = cookies();
    const token = (await cookiesStore).get(process.env.AUTH_TOKEN_SECRET || '');
    const body = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await branchesAPI.updateBranch(body, token?.value || "");

        if (!data.id) throw new Error('Failed branch update');

        return NextResponse.json({ profile: data, status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Branch update failure " + error, status: 404 }));
    }
}

export async function DELETE(request: NextRequest) {
    const cookiesStore = cookies();
    const token = (await cookiesStore).get(process.env.AUTH_TOKEN_SECRET || '');
    const body = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await branchesAPI.deleteBranch(body, token?.value || "");

        if (!data.id) throw new Error('Failed branch delete');

        return NextResponse.json({ profile: data, status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Branch delete failure " + error, status: 404 }));
    }
}