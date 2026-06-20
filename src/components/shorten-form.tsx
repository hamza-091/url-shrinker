import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, Check, X, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createLink, isAliasAvailable, type ExpiryDays, type LinkRow } from "@/lib/links";
import { isValidAlias } from "@/lib/short-code";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = {
  onCreated: (link: LinkRow) => void;
};

export function ShortenForm({ onCreated }: Props) {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [expiry, setExpiry] = useState<ExpiryDays>(null);
  const [loading, setLoading] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [aliasState, setAliasState] = useState<"idle" | "checking" | "ok" | "taken" | "invalid">("idle");

  useEffect(() => {
    if (!alias) {
      setAliasState("idle");
      return;
    }
    if (!isValidAlias(alias)) {
      setAliasState("invalid");
      return;
    }
    setAliasState("checking");
    const t = setTimeout(async () => {
      const free = await isAliasAvailable(alias);
      setAliasState(free ? "ok" : "taken");
    }, 350);
    return () => clearTimeout(t);
  }, [alias]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const link = await createLink({
        url,
        alias: alias || undefined,
        expiresInDays: expiry,
      });
      onCreated(link);
      setUrl("");
      setAlias("");
      setExpiry(null);
      setCustomOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const expiryOptions: { label: string; value: ExpiryDays }[] = [
    { label: "Never", value: null },
    { label: "7 days", value: 7 },
    { label: "30 days", value: 30 },
    { label: "90 days", value: 90 },
  ];

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="bg-gradient-card shadow-card rounded-2xl border border-border/60 p-2 sm:p-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            type="text"
            inputMode="url"
            placeholder="Paste a long URL — example.com/very/long/path"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-14 flex-1 border-0 bg-transparent text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            required
          />
          <Button
            type="submit"
            disabled={loading || !url}
            className="h-14 gap-2 bg-gradient-primary px-6 text-base font-semibold text-primary-foreground shadow-glow transition-all hover:scale-[1.02] hover:shadow-glow disabled:opacity-60 disabled:hover:scale-100"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Shorten <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setCustomOpen((v) => !v)}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Customize your link
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", customOpen && "rotate-180")} />
        </button>

        <AnimatePresence initial={false}>
          {customOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="grid gap-4 px-2 pb-2 pt-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="alias" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Custom alias
                  </Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      shrinkr/
                    </span>
                    <Input
                      id="alias"
                      value={alias}
                      onChange={(e) => setAlias(e.target.value)}
                      placeholder="my-link"
                      className="pl-[68px] pr-9"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {aliasState === "checking" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                      {aliasState === "ok" && <Check className="h-4 w-4 text-success" />}
                      {(aliasState === "taken" || aliasState === "invalid") && (
                        <X className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </div>
                  {aliasState === "taken" && (
                    <p className="text-xs text-destructive">That alias is taken.</p>
                  )}
                  {aliasState === "invalid" && (
                    <p className="text-xs text-destructive">3-32 chars: letters, numbers, _ or -</p>
                  )}
                  {aliasState === "ok" && (
                    <p className="text-xs text-success">Available!</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Expires after
                  </Label>
                  <div className="flex flex-wrap gap-1.5">
                    {expiryOptions.map((opt) => (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => setExpiry(opt.value)}
                        className={cn(
                          "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                          expiry === opt.value
                            ? "border-primary bg-primary text-primary-foreground shadow-soft"
                            : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
