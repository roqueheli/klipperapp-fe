import authAPI from "@/lib/auth/auth.service";
import { AccesDeniedError } from "@/lib/common/http.errors";
import LoginScheme from "@/schemes/login.scheme";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await LoginScheme.validate(await request.json());

  try {
    const loginResponse = await authAPI.login(email, password);

    const expiresInSeconds = (Number(process.env.NEXT_AUTH_TOKEN_EXP || 8 * 60 * 60) * 1000);
    const cookieName = process.env.AUTH_TOKEN_SECRET || "auth_token";
    const isProd = process.env.NODE_ENV === "production";

    // Establecer cookie usando API nativa de Next.js
    (await cookies()).set(cookieName, loginResponse.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd, // Safari bloquea secure en localhost
      path: "/",
      maxAge: expiresInSeconds,
    });

    return NextResponse.json({ status: 200, loginResponse });

  } catch (error) {
    if (error instanceof AccesDeniedError) {
      return new Response(JSON.stringify({ error: "Access Denied" }), { status: 403 });
    } else {
      return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
  }
}
