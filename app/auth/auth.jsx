import "server-only";
import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";

export async function updateSession() {
  const session = (await cookies()).get("mgr_token")?.value;
  const payload = await decrypt(session);

  console.log("updateSession", session, payload);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}
