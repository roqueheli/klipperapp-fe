import servicesAPI from "@/lib/services/services.service";
import { getToken } from "@/lib/utils/auth.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const token = await getToken();
    const searchParams = request.nextUrl.searchParams;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const services = await servicesAPI.getServices(searchParams, token);

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
    const token = await getToken();
    const body = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await servicesAPI.createService(body, token);

        if (!data.id) throw new Error('Failed service create');

        return NextResponse.json({ profile: data, status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Service create failure " + error, status: 404 }));
    }
}