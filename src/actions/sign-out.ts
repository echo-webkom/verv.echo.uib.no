"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { auth, getLucia } from "@/lib/auth/lucia";

export const signOutAction = async (redirectTo?: string) => {
  const lucia = await getLucia();
  const user = await auth();
  const cookieStore = await cookies();

  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(user.session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return redirect(redirectTo ?? "/");
};
