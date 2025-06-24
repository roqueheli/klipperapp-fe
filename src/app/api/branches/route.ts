import branchesAPI from "@/lib/branches/branches.service";
import { getToken } from "@/lib/utils/auth.utils";
import { NextRequest, NextResponse } from "next/server";

async function handleRequest(request: NextRequest, action: string) {
    const token = await getToken();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        let result;
        const body = action !== 'GET' ? await request.json() : undefined;
        const searchParams = action === 'GET' ? new URLSearchParams(request.nextUrl.searchParams) : new URLSearchParams();

        switch (action) {
            case 'GET':
                result = await branchesAPI.getBranches(searchParams, token);
                if (!result) throw new Error('Branches not found');
                return NextResponse.json({ branches: result, status: 200 });

            case 'PUT':
                result = await branchesAPI.updateBranch(body, token);
                if (!result.id) throw new Error('Failed branch update');
                return NextResponse.json({ profile: result, status: 200 });

            case 'POST':
                result = await branchesAPI.createBranch(body, token);
                if (!result.id) throw new Error('Failed branch create');
                return NextResponse.json({ profile: result, status: 200 });

            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: `${action} failure ${error}`, status: 404 }));
    }
}

export async function GET(request: NextRequest) {
    return handleRequest(request, 'GET');
}

export async function PUT(request: NextRequest) {
    return handleRequest(request, 'PUT');
}

export async function POST(request: NextRequest) {
    return handleRequest(request, 'POST');
}
