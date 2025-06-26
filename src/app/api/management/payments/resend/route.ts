import paymentsAPI from "@/lib/payments/payments.service";
import { getToken } from "@/lib/utils/auth.utils";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
    const token = await getToken();
    const body = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const payments = await paymentsAPI.resendPayment(body, token);

        if (!payments) {
            throw new Error('Payment not found');
        }

        return NextResponse.json(payments);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Payment resend failure " + error, status: 404 }));
    }
}
