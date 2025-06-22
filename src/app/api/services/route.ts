import servicesAPI from "@/lib/services/services.service";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const cookiesStore = cookies();
    const token = (await cookiesStore).get(process.env.AUTH_TOKEN_SECRET || '');
    const searchParams = request.nextUrl.searchParams;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const services = await servicesAPI.getServices(searchParams, token?.value || "");

        if (!services) {
            throw new Error('Service not found');
        }

        return NextResponse.json({
            services,
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Service not found " + error, status: 404 }));
    }
}

export async function POST(request: NextRequest) {
    const cookiesStore = cookies();
    const token = (await cookiesStore).get(process.env.AUTH_TOKEN_SECRET || '');
    const body = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await servicesAPI.createService(body, token?.value || "");

        if (!data.id) throw new Error('Failed service create');

        return NextResponse.json({ profile: data, status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Service create failure " + error, status: 404 }));
    }
}