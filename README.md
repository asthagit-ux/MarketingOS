# MarketingOS — AI Copilot for Growth Teams

Persona-aware marketing copy generation: **Solo Founder**, **Growth Manager**, and **Agency Strategist**. Built with **Next.js 14**, **TypeScript**, **Tailwind**, **LangChain**, and **Gemini 2.0 Flash**. Deploy target: **Vercel**.

## What ships in v1

- **Anonymous use** — no accounts; wizard state is stored in **`sessionStorage`** in the browser (survives refresh in the same tab; cleared on “Start over” or when you clear site data).
- **Flow**: Persona → Brief → Draft & refine (tone, audience, length, optional instruction) → Export (Markdown, plain text, HTML, JSON).
- **API**: `POST /api/generate` and `POST /api/refine` with **Zod** validation, structured JSON output from the model, JSON repair pass on parse failure, bounded retries and invoke timeout.
- **Guards**: Basic **per-IP rate limiting** on `/api/*` (middleware), security headers in `next.config.mjs`, `GEMINI_API_KEY` **server-only**.
- **Observability**: Structured **JSON logs** per request (`requestId`, `durationMs`, route, persona, status). **Sentry** is optional: set `NEXT_PUBLIC_SENTRY_DSN` (and optionally `SENTRY_DSN`) to capture client/server errors; see below.
- **Privacy page**: [`/privacy`](app/privacy/page.tsx) — data handling and third parties; linked from the site footer on every page.

Legacy routes **`/dashboard`** and **`/onboarding`** redirect to **`/`** (single primary journey).

## Setup

```bash
npm install
cp .env.example .env.local
# Set GEMINI_API_KEY in .env.local — https://aistudio.google.com/app/apikey
npm run dev
# http://localhost:3000
```

```bash
npm run build   # production check
npm run lint
npm run test    # Vitest — Zod validation unit tests
```

## Deploy (Vercel)

1. Connect the repo to Vercel.
2. Set **`GEMINI_API_KEY`** (required for AI routes).
3. Optionally set **`NEXT_PUBLIC_SENTRY_DSN`** (browser + Edge middleware) and **`SENTRY_DSN`** if you want a different server-only DSN; if only `NEXT_PUBLIC_SENTRY_DSN` is set, the server config falls back to it. Leave unset to keep Sentry disabled.
4. Deploy; confirm `next build` passes in the Vercel build log.

## Project structure (high level)

| Area | Role |
|------|------|
| [`app/page.tsx`](app/page.tsx) | Main wizard UI + session persistence |
| [`app/api/generate/route.ts`](app/api/generate/route.ts) | Generate copy (JSON schema) |
| [`app/api/refine/route.ts`](app/api/refine/route.ts) | Refine existing structured output |
| [`lib/prompts/marketing.ts`](lib/prompts/marketing.ts) | System + user prompts (AIDA / JTBD) |
| [`lib/langchain/client.ts`](lib/langchain/client.ts) | Gemini invoke, validate, repair |
| [`lib/validation/api.ts`](lib/validation/api.ts) | Zod request/response shapes |
| [`lib/client/generation.ts`](lib/client/generation.ts) | Browser `fetch` helpers for APIs |
| [`app/privacy/page.tsx`](app/privacy/page.tsx) | Privacy policy (v1 scope) |
| [`app/global-error.tsx`](app/global-error.tsx) | Root error UI + Sentry capture |
| [`instrumentation.ts`](instrumentation.ts) | Loads Sentry server + edge configs |
| [`instrumentation-client.ts`](instrumentation-client.ts) | Sentry browser init |
| [`next.config.mjs`](next.config.mjs) | `withSentryConfig` (source map upload **disabled**) + security headers |
| [`lib/validation/api.test.ts`](lib/validation/api.test.ts) | Vitest coverage for request schemas |
| [`middleware.ts`](middleware.ts) | Rate limit for `/api/*` |

## Privacy (v1)

Use **`/privacy`** for the full policy. Summary: anonymous product; wizard state in **sessionStorage**; generate/refine sends prompts to **Google AI**; optional **Sentry** when DSN env vars are set.

## Next updates

Ideas for later releases (not in v1):

- **Auth** (Clerk / NextAuth) and **saved briefs + output history** per user
- **Durable rate limiting** (e.g. Vercel KV / Upstash) and **Turnstile / hCaptcha**
- **Automated evals**: golden prompts, strict JSON-schema CI, optional semantic similarity (e.g. BERTScore), **P50/P95** latency dashboards
- **Billing / quotas / teams** and multi-tenant workspaces
- **Brand kit uploads**, campaign memory, CRM / export integrations
- **Model routing** (Flash vs Pro) with in-product cost–latency–quality notes
- **Sentry hardening**: source map upload to Sentry, release health, Session Replay, user context after auth

## Tradeoffs (latency / cost / reliability)

- **Gemini 2.0 Flash** keeps latency and cost low; output is validated with Zod and a **repair** pass improves reliability vs raw string output.
- Raising **`maxOutputTokens`** or switching models increases cost and tail latency; document any change against your SLOs.
