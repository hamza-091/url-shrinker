import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/expired")({
  head: () => ({
    meta: [
      { title: "Link expired — Shrinkr" },
      { name: "description", content: "This short link has expired." },
    ],
  }),
  component: ExpiredPage,
});

function ExpiredPage() {
  return (
    <div className="bg-gradient-hero grid min-h-screen place-items-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
          <Clock className="h-7 w-7" />
        </div>
        <h1 className="font-display text-3xl font-bold">This link has expired</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The short link you tried to open has reached its expiration date and no longer redirects.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          Create a new link
        </Link>
      </div>
    </div>
  );
}
