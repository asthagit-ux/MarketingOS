"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Persona,
  BriefFormData,
  Draft,
  RefinementSettings,
  CopyOutput,
  AudienceSegment,
  ToneValue,
} from "@/types";
import { AUDIENCE_LABELS, TONE_LABELS } from "@/lib/personas";
import { apiGenerate, apiRefine, buildDraft } from "@/lib/client/generation";
import { Copy, Check, Loader2 } from "lucide-react";

interface Props {
  persona: Persona;
  brief: BriefFormData;
  draft: Draft | null;
  onDraftGenerated: (d: Draft) => void;
  onExport: () => void;
  onBack: () => void;
}

export default function OutputEditor({
  persona,
  brief,
  draft,
  onDraftGenerated,
  onExport,
  onBack,
}: Props) {
  const [output, setOutput] = useState<CopyOutput | null>(draft?.output ?? null);
  const [refinement, setRefinement] = useState<RefinementSettings>(
    draft?.refinement ?? {
      tone: persona.toneDefault,
      audience: brief.audience,
      length: "medium",
    }
  );
  const [loading, setLoading] = useState(!draft);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [customInstruction, setCustomInstruction] = useState("");

  const onDraftRef = useRef(onDraftGenerated);
  onDraftRef.current = onDraftGenerated;

  const pushDraft = useCallback((next: CopyOutput, ref: RefinementSettings) => {
    setOutput(next);
    onDraftRef.current(buildDraft(next, persona, brief, ref));
  }, [persona, brief]);

  const briefKey = `${brief.product}\0${brief.goal}\0${brief.audience}\0${brief.outputFormat}\0${brief.additionalContext ?? ""}`;

  useEffect(() => {
    if (draft) {
      setOutput(draft.output);
      setRefinement(draft.refinement);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const initialRef: RefinementSettings = {
        tone: persona.toneDefault,
        audience: brief.audience,
        length: "medium",
      };
      setRefinement(initialRef);
      try {
        const { data } = await apiGenerate({
          personaId: persona.id,
          brief,
          refinement: initialRef,
        });
        if (cancelled) return;
        pushDraft(data, initialRef);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Generation failed");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // briefKey encodes `brief`; draft?.id avoids duplicate runs when draft object identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional narrow deps
  }, [draft?.id, persona.id, persona.toneDefault, briefKey, pushDraft]);

  const handleRegenerate = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const { data } = await apiGenerate({
        personaId: persona.id,
        brief,
        refinement,
      });
      pushDraft(data, refinement);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Regenerate failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleNewAngle = async () => {
    if (!output) return;
    setActionLoading(true);
    setError(null);
    try {
      const { data } = await apiGenerate({
        personaId: persona.id,
        brief,
        refinement,
        variantOf: output,
      });
      pushDraft(data, refinement);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Variant failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!output) return;
    setActionLoading(true);
    setError(null);
    try {
      const { data } = await apiRefine({
        personaId: persona.id,
        output,
        refinement,
        customInstruction: customInstruction.trim() || undefined,
      });
      pushDraft(data, refinement);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Refine failed");
    } finally {
      setActionLoading(false);
    }
  };

  const fullText = output
    ? `${output.hook}\n\n${output.body}\n\n${output.cta}`
    : "";

  const handleCopy = () => {
    if (!fullText) return;
    void navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const busy = loading || actionLoading;

  return (
    <div className="max-w-3xl mx-auto animate-fade-up">
      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
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

      <h2 className="font-display text-3xl font-bold mb-2">Draft & refine</h2>
      <p className="text-os-muted mb-8 text-sm">
        Tune tone, audience, and length, then apply or regenerate. Data stays in this
        browser session until you refresh or start over.
      </p>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,280px)]">
        <div className="space-y-6 order-2 lg:order-1">
          {loading && (
            <div
              className="flex flex-col items-center justify-center gap-3 py-20 text-os-muted border border-os-border rounded-xl bg-os-surface"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="animate-spin text-os-accent" size={28} />
              <span className="text-sm">Generating your draft…</span>
            </div>
          )}

          {!loading && error && (
            <div
              className="border border-os-error/50 bg-os-surface rounded-xl p-4 text-sm text-os-error"
              role="alert"
            >
              {error}
            </div>
          )}

          {!loading && output && (
            <>
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display font-semibold text-lg">Output</h3>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-sm text-os-muted hover:text-os-text transition-colors"
                >
                  {copied ? (
                    <Check size={14} className="text-os-accent" />
                  ) : (
                    <Copy size={14} />
                  )}
                  {copied ? "Copied" : "Copy hook + body + CTA"}
                </button>
              </div>

              <Section label="Hook" text={output.hook} />
              <Section label="Body" text={output.body} />
              <Section label="CTA" text={output.cta} />
              <Section label="Rationale" text={output.rationale} muted />

              {output.variants && output.variants.length > 0 && (
                <div>
                  <p className="text-xs text-os-accent font-medium uppercase tracking-wider mb-3">
                    Variants
                  </p>
                  <div className="flex flex-col gap-3">
                    {output.variants.map((v, i) => (
                      <div
                        key={i}
                        className="border border-os-border rounded-lg p-4 bg-os-surface"
                      >
                        <p className="text-xs font-semibold text-os-accent mb-2">{v.label}</p>
                        <p className="text-sm text-os-text mb-1 whitespace-pre-wrap">{v.hook}</p>
                        <p className="text-sm text-os-muted mb-1 whitespace-pre-wrap">{v.body}</p>
                        <p className="text-sm text-os-accent whitespace-pre-wrap">{v.cta}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <aside className="space-y-4 order-1 lg:order-2">
          <div className="border border-os-border rounded-xl p-4 bg-os-surface space-y-4">
            <p className="text-xs font-medium text-os-accent uppercase tracking-wider">
              Refinement
            </p>

            <label className="block space-y-1.5">
              <span className="text-xs text-os-muted">Tone</span>
              <select
                value={refinement.tone}
                disabled={busy}
                onChange={(e) =>
                  setRefinement((r) => ({ ...r, tone: e.target.value as ToneValue }))
                }
                className="w-full bg-os-bg border border-os-border rounded-lg px-3 py-2 text-sm text-os-text focus:outline-none focus:border-os-accent/60"
              >
                {(Object.keys(TONE_LABELS) as ToneValue[]).map((t) => (
                  <option key={t} value={t}>
                    {TONE_LABELS[t]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs text-os-muted">Audience</span>
              <select
                value={refinement.audience}
                disabled={busy}
                onChange={(e) =>
                  setRefinement((r) => ({
                    ...r,
                    audience: e.target.value as AudienceSegment,
                  }))
                }
                className="w-full bg-os-bg border border-os-border rounded-lg px-3 py-2 text-sm text-os-text focus:outline-none focus:border-os-accent/60"
              >
                {(Object.keys(AUDIENCE_LABELS) as AudienceSegment[]).map((a) => (
                  <option key={a} value={a}>
                    {AUDIENCE_LABELS[a]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs text-os-muted">Length</span>
              <select
                value={refinement.length}
                disabled={busy}
                onChange={(e) =>
                  setRefinement((r) => ({
                    ...r,
                    length: e.target.value as RefinementSettings["length"],
                  }))
                }
                className="w-full bg-os-bg border border-os-border rounded-lg px-3 py-2 text-sm text-os-text focus:outline-none focus:border-os-accent/60"
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs text-os-muted">Extra instruction (optional)</span>
              <textarea
                value={customInstruction}
                disabled={busy}
                onChange={(e) => setCustomInstruction(e.target.value)}
                placeholder="e.g. Mention a free trial, avoid hype words…"
                rows={3}
                className="w-full bg-os-bg border border-os-border rounded-lg px-3 py-2 text-sm text-os-text placeholder:text-os-muted focus:outline-none focus:border-os-accent/60 resize-none"
              />
            </label>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                disabled={busy || !output}
                onClick={handleRefine}
                className="w-full py-2.5 bg-os-surface-2 border border-os-border text-os-text text-sm font-medium rounded-lg hover:border-os-accent/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                Apply refinement
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={handleRegenerate}
                className="w-full py-2.5 bg-os-surface-2 border border-os-border text-os-text text-sm font-medium rounded-lg hover:border-os-accent/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                Regenerate from brief
              </button>
              {persona.id === "growth-manager" && (
                <button
                  type="button"
                  disabled={busy || !output}
                  onClick={handleNewAngle}
                  className="w-full py-2.5 text-sm text-os-accent hover:text-os-accent/80 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  New angle (variant)
                </button>
              )}
            </div>
          </div>

          <button
            type="button"
            disabled={busy || !output}
            onClick={onExport}
            className="w-full py-3.5 bg-os-accent text-black font-display font-bold rounded-lg hover:bg-os-accent/90 disabled:opacity-40 disabled:pointer-events-none transition-colors text-sm"
          >
            Export →
          </button>
        </aside>
      </div>
    </div>
  );
}

function Section({
  label,
  text,
  muted,
}: {
  label: string;
  text: string;
  muted?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-os-muted uppercase tracking-wider mb-1">{label}</p>
      <p
        className={`text-sm leading-relaxed whitespace-pre-wrap ${
          muted ? "text-os-muted italic" : "text-os-text"
        }`}
      >
        {text}
      </p>
    </div>
  );
}
