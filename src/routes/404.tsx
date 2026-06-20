import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/404")({
  head: () => ({ meta: [{ title: "Not found — Shrinkr" }] }),
  component: () => (
    <div className="bg-gradient-hero grid min-h-screen place-items-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-gradient-primary">404</h1>
        <p className="mt-3 text-lg font-semibold">Link not found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The short link you opened doesn't exist or was deleted.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          Go to Shrinkr
        </Link>
      </div>
    </div>
  ),
});
