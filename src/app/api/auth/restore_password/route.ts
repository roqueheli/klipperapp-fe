import authAPI from "@/lib/auth/auth.service";
import { AccesDeniedError } from "@/lib/common/http.errors";
import { getToken } from "@/lib/utils/auth.utils";
import RestoreScheme from "@/schemes/restore.scheme";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const token = await getToken();
    const body = await RestoreScheme.validate(await request.json());

    try {
        const changeResponse = await authAPI.restore_password(body, token || '');

        return NextResponse.json(changeResponse);
    } catch (error) {
        if (error instanceof AccesDeniedError) {
            return new Response(JSON.stringify({ error: "Access Denied" }), { status: 403 });
        } else {
            return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
        }
    }
}
