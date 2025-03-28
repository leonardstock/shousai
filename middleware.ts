import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isUnProtectedRoute = createRouteMatcher([
    "/",
    "/pricing(.*)",
    "/landing(.*)",
    "/privacy(.*)",
    "/terms(.*)",
    "/signin(.*)",
    "/signup(.*)",
    "/reference(.*)",
    "/api/webhooks/(.*)",
    "/api/v1/proxy(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
    if (!isUnProtectedRoute(req)) await auth.protect();
});

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4)).*)",
    ],
};
