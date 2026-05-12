# MarketingOS — AI Copilot for Growth Teams

Domain-specific AI copy generation. Built for founders, growth managers, and agency strategists.

## Stack
- **Next.js 14** (App Router, TypeScript)
- **Gemini 2.0 Flash** via LangChain
- **Tailwind CSS**
- **Vercel** (deploy target)

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add your Gemini API key
```bash
cp .env.example .env.local
# Edit .env.local and paste your key
```
Get a key at: https://aistudio.google.com/app/apikey

### 3. Run locally
```bash
npm run dev
# → http://localhost:3000
```

## Project Structure

```
marketingos/
├── app/
│   ├── api/
│   │   ├── generate/route.ts   # POST: brief + tone → CopyOutput
│   │   └── refine/route.ts     # POST: original + adjustments → CopyOutput
│   ├── onboarding/page.tsx     # Persona selection
│   ├── dashboard/page.tsx      # Main editor (brief + output)
│   └── layout.tsx
├── components/
│   ├── persona/PersonaCard.tsx
│   ├── editor/
│   │   ├── BriefForm.tsx       # Input form (persona-aware)
│   │   └── OutputEditor.tsx    # hook / body / cta / rationale + variants
│   └── export/                 # TODO: export to clipboard/download
├── lib/
│   ├── prompts/templates.ts    # System + generation + refinement prompts
│   ├── langchain/client.ts     # Gemini via LangChain
│   └── utils/
│       ├── constants.ts        # Persona configs, tone labels, formats
│       └── cn.ts
└── types/index.ts              # All shared TypeScript types
```

## TODO / Next Steps
- [ ] Export button — formatted clipboard / download
- [ ] Refine flow UI — inline tone + custom instruction bar
- [ ] Auth (Clerk or NextAuth) for saved briefs
- [ ] History / saved outputs per user
- [ ] Vercel deployment
