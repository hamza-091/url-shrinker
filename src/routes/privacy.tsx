import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Lock, EyeOff, Trash2, ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { motion } from "framer-motion";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Shrinkr" },
      { name: "description", content: "Privacy is our priority. Read about how we handle link redirection and analytics." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col justify-between">
      {/* Background orbs */}
      <div className="bg-gradient-hero pointer-events-none absolute inset-0 -z-10" />
      <div className="pointer-events-none absolute -top-32 -left-32 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-40 -z-10 h-[28rem] w-[28rem] rounded-full bg-primary-glow/10 blur-3xl" />

      <div>
        <SiteHeader />

        <main className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>

            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl mb-3">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-lg mb-12">
              At Shrinkr, we believe that privacy is a fundamental right. Our service is designed to collect as little information as possible.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                icon: EyeOff,
                title: "Zero Tracking",
                description: "We do not track your browsing history, use advertising cookies, or record your IP address when you shorten or visit links.",
              },
              {
                icon: Lock,
                title: "Anonymous Links",
                description: "We generate a random device identifier locally on your browser. This identifier connects you to your shortened links so you can manage them without creating an account.",
              },
              {
                icon: Shield,
                title: "Simple Analytics",
                description: "We only record the total click count for each link so that you can see how many times your short URLs were opened. No location or user data is attached.",
              },
              {
                icon: Trash2,
                title: "Permanent Deletion",
                description: "When you choose to delete a link or clear your history, the records are instantly and permanently erased from our database.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-gradient-card shadow-soft rounded-2xl border border-border/60 p-6"
              >
                <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 border-t border-border/40 pt-8 text-center sm:text-left"
          >
            <p className="text-xs text-muted-foreground">
              Last updated: June 20, 2026. For questions regarding this policy, please manage your links responsibly.
            </p>
          </motion.div>
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
