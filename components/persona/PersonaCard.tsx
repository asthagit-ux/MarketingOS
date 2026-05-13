"use client";

import { Persona } from "@/types";
import { PERSONAS } from "@/lib/personas";

interface PersonaCardProps {
  onSelect: (persona: Persona) => void;
}

export default function PersonaCard({ onSelect }: PersonaCardProps) {
  return (
    <div className="stagger-children">
      <div className="mb-12 text-center">
        <h1 className="font-display text-5xl font-bold tracking-tight mb-4">
          Who are you building for?
        </h1>
        <p className="text-os-muted text-lg max-w-xl mx-auto">
          MarketingOS adapts its output, structure, and tone to your workflow. Pick the
          persona that fits you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PERSONAS.map((persona) => (
          <PersonaChoiceCard key={persona.id} persona={persona} onSelect={onSelect} />
        ))}
      </div>

      <p className="text-center text-os-muted text-xs mt-8">
        Your choice shapes the output format, tone defaults, and prompt strategy.
      </p>
    </div>
  );
}

function PersonaChoiceCard({
  persona,
  onSelect,
}: {
  persona: Persona;
  onSelect: (p: Persona) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(persona)}
      className="group relative text-left p-6 rounded-xl border border-os-border bg-os-surface hover:border-os-accent/60 hover:bg-os-surface-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-os-accent/40"
    >
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(212,245,60,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative">
        <div className="text-3xl mb-4">{persona.icon}</div>

        <h2 className="font-display font-bold text-xl mb-1 group-hover:text-os-accent transition-colors">
          {persona.name}
        </h2>

        <p className="text-os-accent text-xs font-medium mb-3 opacity-70 group-hover:opacity-100 transition-opacity">
          {persona.tagline}
        </p>

        <p className="text-os-muted text-sm leading-relaxed mb-5">
          {persona.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {persona.outputFormats.map((fmt) => (
            <span
              key={fmt}
              className="text-[10px] px-2 py-0.5 rounded-full border border-os-border text-os-muted bg-os-bg group-hover:border-os-accent/30 group-hover:text-os-text transition-colors"
            >
              {fmt.replace(/-/g, " ")}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-2 text-os-muted group-hover:text-os-accent text-sm transition-colors">
          <span>Select</span>
          <span className="transform group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </button>
  );
}
