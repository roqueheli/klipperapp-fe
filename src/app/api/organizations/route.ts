import organizationsAPI from "@/lib/organizations/organizations.service";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
        return NextResponse.json(
            { error: "Slug parameter is required" },
            { status: 400 }
        );
    }

    try {
        const organization = await organizationsAPI.getOrganization(slug);

        if (!organization.id) {
            throw new Error('Organization not found');
        }

        return NextResponse.json({ organization });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Organization not found", status: 404 }));
    }
}