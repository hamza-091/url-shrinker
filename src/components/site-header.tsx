import { Link } from "@tanstack/react-router";
import { Link2 } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="flex h-16 w-full items-center justify-between px-6 lg:px-12">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow transition-transform group-hover:scale-105">
            <Link2 className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">Shrinkr</span>
        </Link>


        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground [&.active]:bg-accent [&.active]:text-foreground"
            activeOptions={{ exact: true }}
          >
            Home
          </Link>
          <Link
            to="/links"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground [&.active]:bg-accent [&.active]:text-foreground"
          >
            My Links
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
