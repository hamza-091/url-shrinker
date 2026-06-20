import { useState } from "react";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { Copy, Check, ExternalLink, RotateCcw, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRModal } from "./qr-modal";
import type { LinkRow } from "@/lib/links";
import { toast } from "sonner";

type Props = {
  link: LinkRow;
  onReset: () => void;
};

export function ResultCard({ link, onReset }: Props) {
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const shortUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/${link.short_code}`;

  async function copy() {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="bg-gradient-card shadow-card rounded-2xl border border-border/60 p-6 sm:p-8"
      >
        <div className="mb-1 flex items-center justify-between">
          <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
            ✓ Ready
          </span>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Shorten another
          </button>
        </div>

        <div className="mt-4 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
          <button
            onClick={() => setQrOpen(true)}
            className="group relative grid h-24 w-24 shrink-0 place-items-center rounded-xl bg-white p-2 shadow-soft transition-all hover:scale-105 hover:shadow-glow"
            aria-label="View QR code"
          >
            <QRCodeCanvas value={shortUrl} size={80} fgColor="#6366f1" />
            <span className="absolute inset-0 grid place-items-center rounded-xl bg-foreground/80 opacity-0 transition-opacity group-hover:opacity-100">
              <QrCode className="h-5 w-5 text-background" />
            </span>
          </button>

          <div className="min-w-0 flex-1">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your short link
            </p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="block truncate font-display text-2xl font-bold text-gradient-primary hover:underline sm:text-3xl"
            >
              {shortUrl.replace(/^https?:\/\//, "")}
            </a>
            <button
              onClick={() => setShowFull((v) => !v)}
              className="mt-1 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-3 w-3" />
              <span className="max-w-[260px] truncate sm:max-w-md">
                {showFull ? link.original_url : `${link.original_url.slice(0, 60)}${link.original_url.length > 60 ? "…" : ""}`}
              </span>
            </button>
          </div>

          <Button
            onClick={copy}
            className="h-12 min-w-[120px] gap-2 bg-gradient-primary text-primary-foreground shadow-soft hover:shadow-glow"
          >
            {copied ? (
              <motion.span
                key="ok"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-1.5"
              >
                <Check className="h-4 w-4" /> Copied!
              </motion.span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Copy className="h-4 w-4" /> Copy
              </span>
            )}
          </Button>
        </div>
      </motion.div>

      <QRModal open={qrOpen} onOpenChange={setQrOpen} url={shortUrl} shortCode={link.short_code} />
    </>
  );
}
