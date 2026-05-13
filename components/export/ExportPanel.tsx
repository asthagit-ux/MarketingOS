"use client";

import { useMemo, useState } from "react";
import { Draft, Persona, ExportOptions } from "@/types";
import { OUTPUT_FORMAT_LABELS } from "@/lib/personas";
import { Check, Copy, Download } from "lucide-react";

interface Props {
  draft: Draft;
  persona: Persona;
  onBack: () => void;
  onReset: () => void;
}

function draftToMarkdown(d: Draft, personaName: string, includeMeta: boolean): string {
  const o = d.output;
  const lines: string[] = [];
  if (includeMeta) {
    lines.push(`---`);
    lines.push(`persona: ${personaName}`);
    lines.push(`format: ${OUTPUT_FORMAT_LABELS[d.format]}`);
    lines.push(`created: ${d.createdAt}`);
    lines.push(`---`);
    lines.push("");
  }
  lines.push(`## Hook`, "", o.hook, "", `## Body`, "", o.body, "", `## CTA`, "", o.cta, "", `## Rationale`, "", o.rationale);
  if (o.variants?.length) {
    lines.push("", `## Variants`);
    for (const v of o.variants) {
      lines.push("", `### ${v.label}`, "", v.hook, "", v.body, "", v.cta);
    }
  }
  return lines.join("\n");
}

function draftToPlain(d: Draft): string {
  const o = d.output;
  let t = `${o.hook}\n\n${o.body}\n\n${o.cta}\n\n${o.rationale}`;
  if (o.variants?.length) {
    t +=
      "\n\n--- Variants ---\n" +
      o.variants.map((v) => `\n${v.label}\n${v.hook}\n${v.body}\n${v.cta}`).join("\n");
  }
  return t;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function draftToHtml(d: Draft, personaName: string, includeMeta: boolean): string {
  const o = d.output;
  const meta =
    includeMeta
      ? `<p class="meta"><strong>${escapeHtml(personaName)}</strong> · ${escapeHtml(OUTPUT_FORMAT_LABELS[d.format])} · ${escapeHtml(d.createdAt)}</p>`
      : "";
  const variants =
    o.variants?.map(
      (v) =>
        `<section class="variant"><h3>${escapeHtml(v.label)}</h3><p>${escapeHtml(v.hook)}</p><p>${escapeHtml(v.body)}</p><p>${escapeHtml(v.cta)}</p></section>`
    ).join("") ?? "";
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>Export</title>
<style>body{font-family:system-ui,sans-serif;max-width:42rem;margin:2rem auto;line-height:1.5;color:#111}
.meta{font-size:0.85rem;color:#555;margin-bottom:2rem}.variant{margin-top:1.5rem;padding-top:1rem;border-top:1px solid #eee}</style></head><body>
${meta}
<h2>Hook</h2><p>${escapeHtml(o.hook).replace(/\n/g, "<br/>")}</p>
<h2>Body</h2><p>${escapeHtml(o.body).replace(/\n/g, "<br/>")}</p>
<h2>CTA</h2><p>${escapeHtml(o.cta).replace(/\n/g, "<br/>")}</p>
<h2>Rationale</h2><p>${escapeHtml(o.rationale).replace(/\n/g, "<br/>")}</p>
${variants}
</body></html>`;
}

export default function ExportPanel({ draft, persona, onBack, onReset }: Props) {
  const [opts, setOpts] = useState<ExportOptions>({
    format: "markdown",
    includeMetadata: true,
  });
  const [copied, setCopied] = useState(false);

  const payload = useMemo(() => {
    switch (opts.format) {
      case "markdown":
        return draftToMarkdown(draft, persona.name, opts.includeMetadata);
      case "plain-text":
        return draftToPlain(draft);
      case "html":
        return draftToHtml(draft, persona.name, opts.includeMetadata);
      case "json":
        return JSON.stringify(
          {
            ...(opts.includeMetadata
              ? { persona: persona.name, format: draft.format, createdAt: draft.createdAt }
              : {}),
            output: draft.output,
          },
          null,
          2
        );
      default:
        return "";
    }
  }, [draft, persona.name, opts.format, opts.includeMetadata]);

  const filename =
    opts.format === "html"
      ? "marketingos-export.html"
      : opts.format === "json"
        ? "marketingos-export.json"
        : "marketingos-export.md";

  const handleCopy = () => {
    void navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([payload], {
      type:
        opts.format === "html"
          ? "text/html"
          : opts.format === "json"
            ? "application/json"
            : "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-up">
      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
          onClick={onBack}
          className="text-os-muted hover:text-os-text text-sm transition-colors"
        >
          ← Back to draft
        </button>
      </div>

      <h2 className="font-display text-3xl font-bold mb-2">Export</h2>
      <p className="text-os-muted mb-8 text-sm">
        Copy or download. Nothing is stored on our servers beyond what the model provider
        receives for each request.
      </p>

      <div className="border border-os-border rounded-xl p-6 bg-os-surface space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block space-y-1.5">
            <span className="text-xs text-os-muted">Format</span>
            <select
              value={opts.format}
              onChange={(e) =>
                setOpts((o) => ({
                  ...o,
                  format: e.target.value as ExportOptions["format"],
                }))
              }
              className="w-full bg-os-bg border border-os-border rounded-lg px-3 py-2 text-sm text-os-text focus:outline-none focus:border-os-accent/60"
            >
              <option value="markdown">Markdown</option>
              <option value="plain-text">Plain text</option>
              <option value="html">HTML</option>
              <option value="json">JSON</option>
            </select>
          </label>
          <label className="flex items-end gap-2 pb-2 cursor-pointer">
            <input
              type="checkbox"
              checked={opts.includeMetadata}
              onChange={(e) =>
                setOpts((o) => ({ ...o, includeMetadata: e.target.checked }))
              }
              className="rounded border-os-border"
            />
            <span className="text-sm text-os-text">Include metadata</span>
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-os-border text-sm text-os-text hover:border-os-accent/50 transition-colors"
          >
            {copied ? <Check size={16} className="text-os-accent" /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy to clipboard"}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-os-accent text-black text-sm font-semibold hover:bg-os-accent/90 transition-colors"
          >
            <Download size={16} />
            Download file
          </button>
        </div>

        <div>
          <p className="text-xs text-os-muted uppercase tracking-wider mb-2">Preview</p>
          <pre className="text-xs text-os-muted bg-os-bg border border-os-border rounded-lg p-4 max-h-64 overflow-auto whitespace-pre-wrap font-mono">
            {payload.slice(0, 8000)}
            {payload.length > 8000 ? "\n…" : ""}
          </pre>
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-8 text-os-muted text-sm hover:text-os-text transition-colors"
      >
        Start over
      </button>
    </div>
  );
}
