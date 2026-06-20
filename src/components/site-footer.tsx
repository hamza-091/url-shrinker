import { Link } from "@tanstack/react-router";
import { Link2 } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background/50">
      <div className="flex w-full flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row lg:px-12">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-primary">
            <Link2 className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-medium">
            Shrinkr <span className="text-muted-foreground">— free, fast, no signup.</span>
          </span>
        </div>
        <div className="flex items-center gap-5 text-sm text-muted-foreground">
          <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}

