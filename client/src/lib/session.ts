import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getUserSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session?.user || null;
  } catch (error) {
    console.error("Error getting user session on server:", error);
    return null;
  }
}
