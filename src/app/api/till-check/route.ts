import conciliationAPI from "@/lib/cash-reconciliation/cash-reconciliation.service";
import { getToken } from "@/lib/utils/auth.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const token = await getToken();
    const searchParams = request.nextUrl.searchParams;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await conciliationAPI.previewConciliation(searchParams, token);

        if (!data) {
            throw new Error('Conciliation not found');
        }

        return NextResponse.json(data);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Conciliation not found " + error, status: 404 }));
    }
}

export async function PATCH(request: NextRequest) {
    const token = await getToken();
    const body = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await conciliationAPI.approveConciliation(body, token);

        if (!data) throw new Error('Failed conciliation update');

        return NextResponse.json(data);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Conciliation update failure " + error, status: 404 }));
    }
}

export async function POST(request: NextRequest) {
    const token = await getToken();
    const body = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await conciliationAPI.createConciliation(body, token);

        if (!data) throw new Error('Failed conciliation create');

        return NextResponse.json(data);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Conciliation creation failure " + error, status: 404 }));
    }
}
