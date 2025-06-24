import { cookies, headers } from "next/headers";

export async function getToken(): Promise<string | null> {
    const headerToken = (await headers()).get("Authorization")?.replace("Bearer ", "");
    const cookieToken = (await cookies()).get(process.env.AUTH_TOKEN_SECRET || "")?.value;
    
    return (await headers()).get("Authorization")?.replace("Bearer ", "") || (await cookies()).get(process.env.AUTH_TOKEN_SECRET || "")?.value || null;
}