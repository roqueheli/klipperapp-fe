import branchesAPI from "@/lib/branches/branches.service";
import { getToken } from "@/lib/utils/auth.utils";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    const token = await getToken();
    const body = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await branchesAPI.updateBranch(body, token);

        if (!data.id) throw new Error('Failed branch update');

        return NextResponse.json({ profile: data, status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Branch update failure " + error, status: 404 }));
    }
}

export async function DELETE(request: NextRequest) {
    const token = await getToken();
    const body = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await branchesAPI.deleteBranch(body, token);

        if (!data.id) throw new Error('Failed branch delete');

        return NextResponse.json({ profile: data, status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Branch delete failure " + error, status: 404 }));
    }
}