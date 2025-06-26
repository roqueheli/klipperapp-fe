import paymentsAPI from "@/lib/payments/payments.service";
import { getToken } from "@/lib/utils/auth.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const token = await getToken();
    const searchParams = request.nextUrl.searchParams;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const payments = await paymentsAPI.geyPayments(searchParams, token);

        if (!payments) {
            throw new Error('Payments not found');
        }

        return NextResponse.json(payments);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Payments get failure: " + error, status: 404 }));
    }
}

export async function POST(request: NextRequest) {
    const token = await getToken();
    const body = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const payments = await paymentsAPI.createPayment(body, token);

        if (!payments) {
            throw new Error('Payment not found');
        }

        return NextResponse.json(payments);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Payment creation failure " + error, status: 404 }));
    }
}
