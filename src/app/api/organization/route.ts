import organizationsAPI from "@/lib/organizations/organizations.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
        return NextResponse.json(
            { error: "Slug parameter is required" },
            { status: 400 }
        );
    }

    try {
        const { id, metadata } = await organizationsAPI.getOrganization(slug);

        if (!id) {
            throw new Error('Organization not found');
        }

        return NextResponse.json({
            id: id,
            data: metadata,
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Organization not found", status: 404 }));
    }
}