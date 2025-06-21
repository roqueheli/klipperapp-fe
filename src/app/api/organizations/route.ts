import organizationsAPI from "@/lib/organizations/organizations.service";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
        return new Response(JSON.stringify({ error: "Organization not found " + error, status: 404 }));
    }
}

export async function PUT(request: NextRequest) {
    const cookiesStore = cookies();
    const token = (await cookiesStore).get(process.env.AUTH_TOKEN_SECRET || '');
    const body = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await organizationsAPI.updateOrganization(body, token?.value || "");

        if (!data.id) throw new Error('Failed organization update');

        return NextResponse.json({ profile: data, status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Organization update failure " + error, status: 404 }));
    }
}