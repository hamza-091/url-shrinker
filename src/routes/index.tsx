import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, QrCode, BarChart3, Sparkles, Clipboard, Wand2, Share2, Shield } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ShortenForm } from "@/components/shorten-form";
import { ResultCard } from "@/components/result-card";
import { getTotalLinkCount, type LinkRow } from "@/lib/links";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shrinkr — Fast, free URL shortener with QR codes" },
      {
        name: "description",
        content:
          "Shorten URLs instantly. Custom aliases, QR codes, click analytics, and link expiration — completely free, no signup.",
      },
      { property: "og:title", content: "Shrinkr — Fast, free URL shortener" },
      {
        property: "og:description",
        content: "Shorten URLs with custom aliases, QR codes, and click analytics. Free forever, no signup.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [result, setResult] = useState<LinkRow | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  useEffect(() => {
    getTotalLinkCount().then(setTotalCount).catch(() => setTotalCount(null));
  }, [result]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background orbs */}
      <div className="bg-gradient-hero pointer-events-none absolute inset-0 -z-10" />
      <div className="pointer-events-none absolute -top-32 -left-32 -z-10 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float-orb" />
      <div className="pointer-events-none absolute top-40 -right-40 -z-10 h-[28rem] w-[28rem] rounded-full bg-primary-glow/20 blur-3xl animate-float-orb [animation-delay:-6s]" />

      <SiteHeader />

      {/* Hero */}
      <section className="relative mx-auto max-w-5xl px-6 pb-20 pt-16 sm:pt-24">
        <motion.div

          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-1.5 text-xs font-medium backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Free forever · No signup · Unlimited links</span>
          </div>

          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Tiny links.{" "}
            <span className="text-gradient-primary">Huge reach.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Shrink any URL in under a second. Customize the back-half, generate a QR code,
            track clicks — all without an account.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-10 max-w-2xl"
        >
          {result ? (
            <ResultCard link={result} onReset={() => setResult(null)} />
          ) : (
            <ShortenForm onCreated={setResult} />
          )}
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-success/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span>
              <span className="font-bold text-foreground">
                {totalCount === null ? "—" : totalCount.toLocaleString()}
              </span>{" "}
              links shortened
            </span>
          </div>
          <div className="hidden h-4 w-px bg-border sm:block" />
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span>Sub-second redirects</span>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <h2 className="mb-12 text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Three steps. One short link.
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { icon: Clipboard, title: "Paste", text: "Drop in any long URL — even sprawling tracking links." },
            { icon: Wand2, title: "Customize", text: "Optional alias and expiration. Pick the QR color you want." },
            { icon: Share2, title: "Share", text: "Copy, download the QR, and watch the clicks roll in." },
          ].map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-card shadow-soft rounded-2xl border border-border/60 p-6"
            >
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <step.icon className="h-5 w-5" />
              </div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Step {i + 1}
              </p>
              <h3 className="mb-1 font-display text-xl font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: QrCode, title: "QR codes", text: "Auto-generated, downloadable as PNG or SVG, color customizable." },
            { icon: BarChart3, title: "Click analytics", text: "See click counts on every link, right from your history." },
            { icon: Zap, title: "Blazing fast", text: "Edge-cached redirects mean visitors never wait." },
            { icon: Shield, title: "No tracking", text: "No account, no spam, no data sold. Ever." },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border/60 bg-background/40 p-5 backdrop-blur-sm transition-colors hover:bg-background/70"
            >
              <f.icon className="mb-3 h-5 w-5 text-primary" />
              <h3 className="mb-1 font-display font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
