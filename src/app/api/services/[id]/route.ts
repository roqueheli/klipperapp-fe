import servicesAPI from "@/lib/services/services.service";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    const cookiesStore = cookies();
    const token = (await cookiesStore).get(process.env.AUTH_TOKEN_SECRET || '');
    const body = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await servicesAPI.updateService(body, token?.value || "");

        if (!data.id) throw new Error('Failed service update');

        return NextResponse.json({ profile: data, status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Service update failure " + error, status: 404 }));
    }
}

export async function DELETE(request: NextRequest) {
    const cookiesStore = cookies();
    const token = (await cookiesStore).get(process.env.AUTH_TOKEN_SECRET || '');
    const body = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await servicesAPI.deleteService(body, token?.value || "");

        if (!data.id) throw new Error('Failed service update');

        return NextResponse.json({ profile: data, status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Service update failure " + error, status: 404 }));
    }
}
