import authAPI from "@/lib/auth/auth.service";
import { AccesDeniedError } from "@/lib/common/http.errors";
import ForgotScheme from "@/schemes/forgot.scheme";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await ForgotScheme.validate(await request.json());

    try {
        const resetResponse = await authAPI.reset_password(body.email);

        return NextResponse.json(resetResponse);
    } catch (error) {
        if (error instanceof AccesDeniedError) {
            return new Response(JSON.stringify({ error: "Access Denied" }), { status: 403 });
        } else {
            return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
        }
    }
}
