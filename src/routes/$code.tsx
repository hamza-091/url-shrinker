import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { Loader2, LinkIcon } from "lucide-react";
import { getLinkByCode, incrementClick, isExpired } from "@/lib/links";

export const Route = createFileRoute("/$code")({
  // Reserved app routes that should not be treated as short codes
  // (TanStack will match more-specific routes first, but this is the catch-all)
  ssr: false,
  loader: async ({ params }) => {
    const code = params.code;
    // Filter out any obvious non-codes (assets, etc.)
    if (!code || code.includes(".")) {
      throw redirect({ to: "/404" });
    }
    const link = await getLinkByCode(code);
    if (!link) {
      throw redirect({ to: "/404" });
    }
    if (isExpired(link)) {
      throw redirect({ to: "/expired" });
    }
    // Fire-and-forget click increment, then redirect via the browser
    incrementClick(link.id, link.clicks).catch(() => {});
    if (typeof window !== "undefined") {
      window.location.replace(link.original_url);
    }
    return { url: link.original_url };
  },
  pendingComponent: RedirectingScreen,
  component: RedirectingScreen,
  errorComponent: () => <NotFoundScreen />,
});

function RedirectingScreen() {
  return (
    <div className="bg-gradient-hero grid min-h-screen place-items-center px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
          <LinkIcon className="h-6 w-6" />
        </div>
        <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">Redirecting…</p>
      </div>
    </div>
  );
}

function NotFoundScreen() {
  return (
    <div className="bg-gradient-hero grid min-h-screen place-items-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-6xl font-bold">404</h1>
        <p className="mt-2 text-lg font-semibold">Link not found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          This short link doesn't exist or was deleted.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          Create a new one
        </Link>
      </div>
    </div>
  );
}
