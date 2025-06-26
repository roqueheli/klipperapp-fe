import { cookies, headers } from "next/headers";

export async function getToken(): Promise<string | null> {
    return (await headers()).get("Authorization")?.replace("Bearer ", "") || (await cookies()).get(process.env.AUTH_TOKEN_SECRET || "")?.value || null;
}