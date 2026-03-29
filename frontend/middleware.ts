import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/health",
  "/api/proxy(.*)",
  "/api/public(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  // PROXY REWRITE FOR BACKEND
  if (req.nextUrl.pathname.startsWith("/api/proxy")) {
    const path = req.nextUrl.pathname.replace("/api/proxy", "");
    const url = new URL(`https://agentforit-backend.onrender.com/api${path}${req.nextUrl.search}`);
    return NextResponse.rewrite(url);
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
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
