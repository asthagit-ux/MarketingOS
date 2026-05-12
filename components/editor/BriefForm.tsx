"use client";

import { useState } from "react";
import { Persona, BriefFormData, AudienceSegment, OutputFormat } from "@/types";
import { OUTPUT_FORMAT_LABELS, AUDIENCE_LABELS } from "@/lib/personas";

interface BriefInputProps {
  persona: Persona;
  onSubmit: (brief: string, formData: BriefFormData) => void;
  onBack: () => void;
}

export default function BriefInput({ persona, onSubmit, onBack }: BriefInputProps) {
  const [form, setForm] = useState<BriefFormData>({
    product: "",
    goal: "",
    audience: "b2b-smb",
    outputFormat: persona.outputFormats[0],
    additionalContext: "",
  });

  const [errors, setErrors] = useState<Partial<BriefFormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<BriefFormData> = {};
    if (!form.product.trim()) newErrors.product = "Required";
    if (!form.goal.trim()) newErrors.goal = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const summary = `Product: ${form.product}. Goal: ${form.goal}. Format: ${form.outputFormat}. Audience: ${form.audience}.`;
    onSubmit(summary, form);
  };

  const Field = ({
    label,
    hint,
    error,
    children,
  }: {
    label: string;
    hint?: string;
    error?: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-os-text">{label}</label>
        {hint && <span className="text-xs text-os-muted">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-xs text-os-error">{error}</p>}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      {/* Persona badge */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onBack}
          className="text-os-muted hover:text-os-text text-sm transition-colors"
        >
          ← Back
        </button>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-os-surface border border-os-border text-sm">
          <span>{persona.icon}</span>
          <span className="text-os-muted">{persona.name}</span>
        </div>
      </div>

      <h2 className="font-display text-3xl font-bold mb-2">Brief your campaign</h2>
      <p className="text-os-muted mb-8">
        Be as specific as you can. The more context you give, the sharper the output.
      </p>

      <div className="space-y-6">
        {/* Hints from persona */}
        <div className="bg-os-surface border border-os-border rounded-lg p-4 space-y-1">
          <p className="text-xs text-os-accent font-medium mb-2">
            💡 Prompts for {persona.name}s
          </p>
          {persona.inputHints.map((hint, i) => (
            <p key={i} className="text-xs text-os-muted">
              • {hint}
            </p>
          ))}
        </div>

        <Field label="Product / Service" error={errors.product}>
          <textarea
            value={form.product}
            onChange={(e) => setForm({ ...form, product: e.target.value })}
            placeholder="What are you marketing? Describe it in 1-3 sentences."
            rows={2}
            className="w-full bg-os-surface border border-os-border rounded-lg px-4 py-3 text-sm text-os-text placeholder:text-os-muted focus:outline-none focus:border-os-accent/60 resize-none transition-colors"
          />
        </Field>

        <Field label="Campaign Goal" error={errors.goal}>
          <input
            type="text"
            value={form.goal}
            onChange={(e) => setForm({ ...form, goal: e.target.value })}
            placeholder="e.g. Drive sign-ups, launch a new feature, retarget warm leads"
            className="w-full bg-os-surface border border-os-border rounded-lg px-4 py-3 text-sm text-os-text placeholder:text-os-muted focus:outline-none focus:border-os-accent/60 transition-colors"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Output Format">
            <select
              value={form.outputFormat}
              onChange={(e) =>
                setForm({ ...form, outputFormat: e.target.value as OutputFormat })
              }
              className="w-full bg-os-surface border border-os-border rounded-lg px-4 py-3 text-sm text-os-text focus:outline-none focus:border-os-accent/60 transition-colors"
            >
              {persona.outputFormats.map((fmt) => (
                <option key={fmt} value={fmt}>
                  {OUTPUT_FORMAT_LABELS[fmt]}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Target Audience">
            <select
              value={form.audience}
              onChange={(e) =>
                setForm({ ...form, audience: e.target.value as AudienceSegment })
              }
              className="w-full bg-os-surface border border-os-border rounded-lg px-4 py-3 text-sm text-os-text focus:outline-none focus:border-os-accent/60 transition-colors"
            >
              {Object.entries(AUDIENCE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Additional Context" hint="Optional">
          <textarea
            value={form.additionalContext}
            onChange={(e) =>
              setForm({ ...form, additionalContext: e.target.value })
            }
            placeholder="Competitors, brand voice, key differentiators, constraints..."
            rows={3}
            className="w-full bg-os-surface border border-os-border rounded-lg px-4 py-3 text-sm text-os-text placeholder:text-os-muted focus:outline-none focus:border-os-accent/60 resize-none transition-colors"
          />
        </Field>

        <button
          onClick={handleSubmit}
          className="w-full py-3.5 bg-os-accent text-black font-display font-bold rounded-lg hover:bg-os-accent/90 transition-colors text-sm"
        >
          Generate Draft →
        </button>
      </div>
    </div>
  );
}