import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2, Link2, ArrowUpDown } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LinkHistoryCard } from "@/components/link-history-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteAllMyLinks, deleteLink, listMyLinks, type LinkRow } from "@/lib/links";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/links")({
  head: () => ({
    meta: [
      { title: "My Links — Shrinkr" },
      { name: "description", content: "Manage every short link you've created on this device." },
    ],
  }),
  component: LinksPage,
});

type SortKey = "newest" | "oldest" | "clicks";

function LinksPage() {
  const [links, setLinks] = useState<LinkRow[] | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");

  async function refresh() {
    try {
      const data = await listMyLinks();
      setLinks(data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
      setLinks([]);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onDelete(id: string) {
    setLinks((prev) => prev?.filter((l) => l.id !== id) ?? null);
    try {
      await deleteLink(id);
      toast.success("Link deleted");
    } catch {
      toast.error("Failed to delete");
      refresh();
    }
  }

  async function onClearAll() {
    try {
      await deleteAllMyLinks();
      setLinks([]);
      toast.success("History cleared");
    } catch {
      toast.error("Failed to clear");
    }
  }

  const filtered = useMemo(() => {
    if (!links) return null;
    const q = query.trim().toLowerCase();
    const matched = q
      ? links.filter(
          (l) =>
            l.short_code.toLowerCase().includes(q) ||
            l.original_url.toLowerCase().includes(q),
        )
      : links;
    const sorted = [...matched].sort((a, b) => {
      if (sort === "newest") return +new Date(b.created_at) - +new Date(a.created_at);
      if (sort === "oldest") return +new Date(a.created_at) - +new Date(b.created_at);
      return b.clicks - a.clicks;
    });
    return sorted;
  }, [links, query, sort]);

  return (
    <div className="relative min-h-screen">
      <div className="bg-gradient-hero pointer-events-none absolute inset-0 -z-10 opacity-50" />
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8 flex items-end justify-between gap-4">

          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">My Links</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {links === null ? "Loading…" : `${links.length} link${links.length === 1 ? "" : "s"} on this device`}
            </p>
          </div>
          {links && links.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" /> Clear all
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all {links.length} short links on this device. The links themselves
                    will stop working. This can't be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onClearAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Yes, clear everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {links && links.length > 0 && (
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by code or URL…"
                className="pl-9"
              />
            </div>
            <div className="flex gap-1.5">
              {(["newest", "oldest", "clicks"] as SortKey[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={cn(
                    "flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium capitalize transition-colors",
                    sort === s
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  )}
                >
                  <ArrowUpDown className="h-3 w-3" />
                  {s === "clicks" ? "Most clicked" : s}
                </button>
              ))}
            </div>
          </div>
        )}

        {links === null && (
          <div className="grid gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        )}

        {links && links.length === 0 && <EmptyState />}

        {filtered && (
          <motion.div layout className="grid gap-3">
            <AnimatePresence>
              {filtered.map((link) => (
                <LinkHistoryCard key={link.id} link={link} onDelete={onDelete} />
              ))}
            </AnimatePresence>
            {filtered.length === 0 && links && links.length > 0 && (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No links match "{query}".
              </p>
            )}
          </motion.div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-gradient-card shadow-soft rounded-3xl border border-border/60 p-12 text-center">
      <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
        <Link2 className="h-7 w-7" />
      </div>
      <h2 className="font-display text-xl font-bold">No links yet</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        Every link you shorten will show up here, scoped to this browser. No account needed.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105"
      >
        Shorten your first link
      </Link>
    </div>
  );
}
