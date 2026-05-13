import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy — MarketingOS",
  description: "How MarketingOS handles your data in v1 (anonymous, browser session, AI provider).",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-os-bg text-os-text font-body flex flex-col">
      <div className="max-w-2xl mx-auto px-6 py-16 flex-1">
        <Link
          href="/"
          className="text-sm text-os-muted hover:text-os-accent transition-colors mb-10 inline-block"
        >
          ← Back to app
        </Link>
        <h1 className="font-display text-4xl font-bold tracking-tight mb-4">Privacy</h1>
        <p className="text-os-muted text-sm mb-10">Last updated for MarketingOS v1.</p>

        <div className="space-y-8 text-sm leading-relaxed text-os-text">
          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-os-text">What we collect</h2>
            <p className="text-os-muted">
              MarketingOS v1 does <strong className="text-os-text">not</strong> offer user accounts. We do
              not intentionally store your marketing briefs or generated copy on our servers after a request
              completes. Your wizard progress may be kept in your browser&apos;s{" "}
              <code className="text-os-accent bg-os-surface px-1 rounded">sessionStorage</code> so a page refresh
              in the same tab can restore your session.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-os-text">Third parties</h2>
            <p className="text-os-muted">
              When you click generate or refine, your prompts and context are sent to{" "}
              <strong className="text-os-text">Google Generative AI</strong> (Gemini) through our hosting
              provider&apos;s servers so we can call the model. Processing of that data is subject to{" "}
              <a
                href="https://ai.google.dev/terms"
                className="text-os-accent hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google&apos;s terms
              </a>{" "}
              and policies. We recommend not submitting secrets, regulated health/financial data, or personal
              information you are not allowed to share.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-os-text">Hosting & logs</h2>
            <p className="text-os-muted">
              Our infrastructure (for example Vercel) may keep short-lived access or error logs. We also emit
              structured logs for API requests (such as duration and a request id) to operate and debug the
              service — not to build a marketing profile about you.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-os-text">Optional error reporting</h2>
            <p className="text-os-muted">
              If the project maintainer configures Sentry (or similar), client or server errors may be sent to
              that service to fix bugs. See the project README for which environment variables enable this.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-os-text">Contact</h2>
            <p className="text-os-muted">
              This is an independent demo / product surface. For privacy questions, contact the repository or
              deployment owner listed with your deployment.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
