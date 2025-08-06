import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { nanoid } from "nanoid";

import { feide, getFeideUser } from "@/lib/auth/feide";
import { getLucia } from "@/lib/auth/lucia";
import { getDb } from "@/lib/db/drizzle";
import { accounts, memberships, users } from "@/lib/db/schemas";
import { getEchoGroups } from "@/lib/get-echo-groups";

export const GET = async (request: Request) => {
  const db = await getDb();
  const lucia = await getLucia();

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const storedState = cookieStore.get("feide_oauth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await feide.validateAuthorizationCode(code);
    const feideUser = await getFeideUser(tokens.accessToken);

    const existingUser = await db.query.accounts.findFirst({
      where: (account, { eq, and }) =>
        and(eq(account.provider, "feide"), eq(account.providerAccountId, feideUser.id)),
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const userId = nanoid();

    await db.transaction(async (tx) => {
      await tx.insert(users).values({
        id: userId,
        name: feideUser.name,
        email: feideUser.email,
      });

      await tx.insert(accounts).values({
        userId: userId,
        provider: "feide",
        providerAccountId: feideUser.id,
        accessToken: tokens.accessToken,
      });
    });

    const groups = await getEchoGroups(feideUser.id);

    if (groups.length > 0) {
      await db.insert(memberships).values(
        groups.map((groupId) => ({
          groupId,
          userId,
        })),
      );
    }

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    console.error(e);

    if (e instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      });
    }

    return new Response(null, {
      status: 500,
    });
  }
};
