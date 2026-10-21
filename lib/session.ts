import { auth } from "./auth";

export type AppRole = "student" | "parent" | "tutor";

export interface AppSession {
  name: string;
  email: string;
  role: AppRole;
}

function normalizeRole(value?: string | null): AppRole {
  if (value === "parent" || value === "tutor") return value;
  return "student";
}

export async function getSession(): Promise<AppSession | null> {
  try {
    const session = await auth();
    if (!session?.user?.email) return null;
    return {
      name: session.user.name ?? session.user.email,
      email: session.user.email,
      role: normalizeRole(session.user.role),
    };
  } catch {
    return null;
  }
}

export async function requireRole(
  roles: AppRole[],
): Promise<AppSession | null> {
  const session = await getSession();
  if (!session) return null;
  if (!roles.includes(session.role)) return null;
  return session;
}
