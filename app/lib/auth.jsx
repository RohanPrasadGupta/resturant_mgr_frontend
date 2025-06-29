// app/lib/auth.js
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export function getSessionUser() {
  const cookieStore = cookies();
  const token = cookieStore.get("mgr-token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch {
    return null;
  }
}
