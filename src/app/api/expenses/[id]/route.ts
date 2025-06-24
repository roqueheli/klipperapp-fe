import expensesAPI from "@/lib/expenses/expenses.service";
import { getToken } from "@/lib/utils/auth.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const token = await getToken();
    const searchParams = request.nextUrl.searchParams;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const expenses = await expensesAPI.getExpenses(searchParams, token);

        if (!expenses) {
            throw new Error('Expenses not found');
        }

        return NextResponse.json({
            expenses,
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Expenses failure " + error, status: 404 }));
    }
}

export async function POST(request: NextRequest) {
    const token = await getToken();
    const body = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const expenses = await expensesAPI.createExpenses(body, token);

        if (!expenses) {
            throw new Error('Expenses not found');
        }

        return NextResponse.json({
            expenses,
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Expenses failure " + error, status: 404 }));
    }
}

export async function PUT(request: NextRequest) {
    const token = await getToken();
    const body = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const expenses = await expensesAPI.updateExpenses(body, token);

        if (!expenses) {
            throw new Error('Expenses not found');
        }

        return NextResponse.json({
            expenses,
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Expenses failure " + error, status: 404 }));
    }
}


export async function DELETE(request: NextRequest) {
    const token = await getToken();
    const body = await request.json();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const expenses = await expensesAPI.deleteExpenses(body, token);

        if (!expenses) {
            throw new Error('Expenses not found');
        }

        return NextResponse.json({
            expenses,
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Expenses delete failure " + error, status: 404 }));
    }
}