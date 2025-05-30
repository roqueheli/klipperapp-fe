import customersAPI from "@/lib/customers/customers.service";
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
        const { id } = await customersAPI.getCustomer(slug);

        if (!id) {
            throw new Error('Customer not found');
        }

        return NextResponse.json({
            id: id,
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Customer not found", status: 404 }));
    }
}
