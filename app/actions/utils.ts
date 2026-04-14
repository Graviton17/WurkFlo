import { auth } from "@/lib/auth";

export async function requireUser() {
  const user = await auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}
