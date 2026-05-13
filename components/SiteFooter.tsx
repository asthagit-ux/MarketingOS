import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-os-border mt-auto py-6 px-6 text-center text-xs text-os-muted">
      <Link href="/privacy" className="hover:text-os-accent transition-colors underline-offset-4 hover:underline">
        Privacy
      </Link>
      <span className="mx-2 text-os-border">·</span>
      <span>MarketingOS — prompts are processed by Google AI when you generate or refine.</span>
    </footer>
  );
}
