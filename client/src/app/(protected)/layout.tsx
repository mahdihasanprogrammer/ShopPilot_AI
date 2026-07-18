import RouteGuard from "@/components/shared/RouteGuard";

/**
 * Protected Route Group Layout
 *
 * Two-layer protection strategy (PRD §3 / §11):
 *
 * Layer 1 — Edge Middleware (middleware.ts):
 *   Fast, cookie-based session check. Redirects unauthenticated requests
 *   to /login?callbackUrl=<original-path> before the page renders.
 *
 * Layer 2 — Client RouteGuard (this layout):
 *   Hydrated role check. Redirects authenticated-but-wrong-role visitors
 *   (e.g. regular user accessing /dashboard/admin) to /dashboard/user.
 *
 * Real security boundary remains on the Express backend via
 * requireAuth / requireAdmin middleware (Prompt 03).
 */
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteGuard>{children}</RouteGuard>;
}
