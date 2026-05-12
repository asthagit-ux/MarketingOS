"use client";
import { useState } from "react";
import { CopyOutput } from "@/types";
import { Copy, Check } from "lucide-react";

interface Props {
  output: CopyOutput | null;
}

export function OutputEditor({ output }: Props) {
  const [copied, setCopied] = useState(false);

  if (!output) {
    return (
      <div className="flex items-center justify-center h-full text-gray-600 text-sm">
        Fill in the brief and hit Generate.
      </div>
    );
  }

  const fullText = `${output.hook}\n\n${output.body}\n\n${output.cta}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Output</h2>
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
          {copied ? <Check size={14} className="text-teal-400" /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy all"}
        </button>
      </div>

      <Section label="Hook" text={output.hook} />
      <Section label="Body" text={output.body} />
      <Section label="CTA" text={output.cta} />
      <Section label="Rationale" text={output.rationale} muted />

      {output.variants && output.variants.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Variants</p>
          <div className="flex flex-col gap-3">
            {output.variants.map((v, i) => (
              <div key={i} className="border border-gray-800 rounded-lg p-4">
                <p className="text-xs font-semibold text-teal-400 mb-2">{v.label}</p>
                <p className="text-sm text-white mb-1">{v.hook}</p>
                <p className="text-sm text-gray-400 mb-1">{v.body}</p>
                <p className="text-sm text-teal-300">{v.cta}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ label, text, muted }: { label: string; text: string; muted?: boolean }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-sm leading-relaxed whitespace-pre-wrap ${muted ? "text-gray-500 italic" : "text-white"}`}>{text}</p>
    </div>
  );
}
