import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/saved-cars(.*)",
  "/reservations(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const SITE_KEY = "nex_live_040e1a25634cf6fa1ad062aa97aadee0";

  // Replace with your production Nexasoft Admin Portal URL when deployed
  const NEXASOFT_API_URL = process.env.NEXASOFT_ADMIN_URL || "http://localhost:3000";

  // =========================================================================
  // 1. NEXASOFT REMOTE LOCKOUT CHECK (Enforced on Vercel Server)
  // =========================================================================
  try {
    const res = await fetch(
      `${NEXASOFT_API_URL}/api/v1/license/verify?siteKey=${SITE_KEY}&domain=${req.nextUrl.hostname}`,
      { cache: "no-store" }
    );
    const data = await res.json();

    // ⛔ IF BLOCKED IN NEXASOFT ADMIN PANEL -> BLOCK IMMEDIATELY ON SERVER
    if (data.status === "BLOCKED") {
      const lockConfig = data.lockConfig || {};
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>${lockConfig.headline || "Services Suspended"}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
              body { background: #0a0f1d; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; padding: 20px; box-sizing: border-box; }
              .card { background: #111827; border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 36px; max-width: 500px; width: 100%; box-shadow: 0 20px 50px rgba(0,0,0,0.8); }
              .badge { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #e11d48; font-weight: bold; margin-bottom: 12px; }
              h1 { color: #ffffff; margin: 0 0 12px 0; font-size: 22px; font-weight: 700; }
              p { color: #94a3b8; line-height: 1.6; margin: 0 0 24px 0; font-size: 14px; }
              a { color: #60a5fa; text-decoration: none; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="badge">NEXASOFT UK ACCESS CONTROL</div>
              <h1>${lockConfig.headline || "Access Suspended"}</h1>
              <p>${lockConfig.message || "Access to this web application is temporarily suspended. Please contact Nexasoft UK support."}</p>
              <p>Contact Support: <a href="mailto:${lockConfig.supportEmail || "support@nexasoft.uk"}">${lockConfig.supportEmail || "support@nexasoft.uk"}</a></p>
            </div>
          </body>
        </html>`,
        {
          status: 403,
          headers: { "content-type": "text/html" },
        }
      );
    }
  } catch (err) {
    // Fail-open for safety during maintenance
  }

  // =========================================================================
  // 2. YOUR EXISTING CLERK AUTHENTICATION LOGIC
  // =========================================================================
  const { userId } = await auth();

  if (!userId && isProtectedRoute(req)) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};