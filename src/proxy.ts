import { after, NextResponse, userAgent, type NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const plausibleUrl = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL;

  if (plausibleUrl) {
    const { isBot } = userAgent(req);
    if (isBot) return NextResponse.next();

    const isPrefetch = req.headers.get("next-router-prefetch") === "1";
    if (isPrefetch) return NextResponse.next();

    const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "";
    const ua = req.headers.get("user-agent") ?? "";
    const referrer = req.headers.get("referer") ?? "";

    const apiBase = new URL(plausibleUrl).origin;

    after(async () => {
      await fetch(`${apiBase}/api/event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": ua,
          "X-Forwarded-For": ip,
        },
        body: JSON.stringify({
          name: "pageview",
          url: req.nextUrl.href,
          domain: "verv.echo-webkom.no",
          referrer,
        }),
      }).catch(() => {});
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api/|.*\\.(?:ico|png|svg|jpg|jpeg|webp|css|js)$).*)"],
};
