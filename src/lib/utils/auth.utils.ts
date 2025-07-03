import { cookies, headers } from "next/headers";

export async function getToken(): Promise<string | null> {
    return (await headers()).get("Authorization")?.replace("Bearer ", "") || (await cookies()).get("auth_token")?.value || null;
}