import { useState } from "react";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { Copy, Check, MousePointerClick, Trash2, ExternalLink, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRModal } from "./qr-modal";
import { type LinkRow, isExpired } from "@/lib/links";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = {
  link: LinkRow;
  onDelete: (id: string) => void;
};

export function LinkHistoryCard({ link, onDelete }: Props) {
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const expired = isExpired(link);

  const shortUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/${link.short_code}`;

  async function copy() {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    toast.success("Copied");
    setTimeout(() => setCopied(false), 1500);
  }

  const created = new Date(link.created_at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "group bg-gradient-card shadow-soft hover:shadow-card rounded-xl border border-border/60 p-4 transition-all sm:p-5",
          expired && "opacity-60"
        )}
      >
        <div className="flex gap-4">
          <button
            onClick={() => !expired && setQrOpen(true)}
            disabled={expired}
            className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-white p-1.5 shadow-soft transition-transform hover:scale-105 disabled:hover:scale-100"
            aria-label="View QR"
          >
            <QRCodeCanvas value={shortUrl} size={52} fgColor={expired ? "#888" : "#6366f1"} />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <a
                href={expired ? undefined : shortUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "truncate font-display text-base font-semibold",
                  expired ? "text-muted-foreground" : "text-foreground hover:text-primary"
                )}
              >
                /{link.short_code}
              </a>
              {link.custom_alias && !expired && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">
                  custom
                </span>
              )}
              {expired && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
                  expired
                </span>
              )}
            </div>
            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
              <ExternalLink className="h-3 w-3 shrink-0" />
              <span className="truncate">{link.original_url}</span>
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {created}
              </span>
              <span className="flex items-center gap-1 font-medium text-foreground">
                <MousePointerClick className="h-3 w-3 text-primary" /> {link.clicks} {link.clicks === 1 ? "click" : "clicks"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Button size="icon" variant="ghost" onClick={copy} className="h-8 w-8" aria-label="Copy">
              {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(link.id)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      <QRModal open={qrOpen} onOpenChange={setQrOpen} url={shortUrl} shortCode={link.short_code} />
    </>
  );
}
