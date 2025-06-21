import branchesAPI from "@/lib/branches/branches.service";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const cookiesStore = cookies();
    const token = (await cookiesStore).get(process.env.AUTH_TOKEN_SECRET || '');
    const searchParams = request.nextUrl.searchParams;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const branches = await branchesAPI.getBranches(searchParams, token?.value || "");

        if (!branches) {
            throw new Error('Branches not found');
        }

        return NextResponse.json({
            branches,
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Branches failure " + error, status: 404 }));
    }
}