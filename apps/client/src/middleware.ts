import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/"]);
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    const { isAuthenticated, } = await auth();
    if (!isAuthenticated) {
      if(isAuthRoute(req)) {
        return NextResponse.next();
      }
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", "/dashboard");
      return NextResponse.redirect(signInUrl);
    }
    if(isAuthRoute(req)) {
      const dashboardUrl = new URL("/dashboard", req.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpeg|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
