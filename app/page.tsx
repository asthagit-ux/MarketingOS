"use client";

import { useEffect, useState } from "react";
import PersonaCard from "@/components/persona/PersonaCard";
import BriefForm from "@/components/editor/BriefForm";
import OutputEditor from "@/components/editor/OutputEditor";
import ExportPanel from "@/components/export/ExportPanel";
import { Persona, Draft, BriefFormData } from "@/types";

type Step = "persona" | "brief" | "draft" | "export";

const STORAGE_KEY = "marketingos-wizard-v1";

export default function Home() {
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<Step>("persona");
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [briefData, setBriefData] = useState<BriefFormData | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as {
          step?: Step;
          selectedPersona?: Persona | null;
          briefData?: BriefFormData | null;
          draft?: Draft | null;
        };
        const steps: Step[] = ["persona", "brief", "draft", "export"];
        if (data.step && steps.includes(data.step)) setStep(data.step);
        if (data.selectedPersona) setSelectedPersona(data.selectedPersona);
        if (data.briefData) setBriefData(data.briefData);
        if (data.draft) setDraft(data.draft);
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ step, selectedPersona, briefData, draft })
      );
    } catch {
      /* quota / private mode */
    }
  }, [hydrated, step, selectedPersona, briefData, draft]);

  const handlePersonaSelect = (persona: Persona) => {
    setSelectedPersona(persona);
    setStep("brief");
  };

  const handleBriefSubmit = (_summary: string, formData: BriefFormData) => {
    setBriefData(formData);
    setDraft(null);
    setStep("draft");
  };

  const handleDraftGenerated = (generatedDraft: Draft) => {
    setDraft(generatedDraft);
  };

  const handleExport = () => {
    setStep("export");
  };

  const handleReset = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setStep("persona");
    setSelectedPersona(null);
    setBriefData(null);
    setDraft(null);
  };

  const steps: Step[] = ["persona", "brief", "draft", "export"];
  const stepIdx = steps.indexOf(step);

  return (
    <main className="min-h-screen bg-os-bg text-os-text font-body">
      <header className="border-b border-os-border px-8 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm bg-os-bg/90">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-os-accent rounded-sm flex items-center justify-center">
            <span className="text-black font-display font-bold text-sm">M</span>
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">MarketingOS</span>
          <span className="text-os-muted text-xs border border-os-border px-2 py-0.5 rounded-full">
            AI Copilot
          </span>
        </div>

        <nav
          className="flex items-center gap-1"
          aria-label="Workflow steps"
        >
          {steps.map((s, i) => (
            <button
              key={s}
              type="button"
              aria-current={s === step ? "step" : undefined}
              onClick={() => i <= stepIdx && setStep(s)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
                s === step
                  ? "bg-os-surface text-os-text font-medium"
                  : i < stepIdx
                  ? "text-os-accent cursor-pointer hover:text-os-accent/80"
                  : "text-os-muted cursor-not-allowed"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-mono ${
                  i < stepIdx
                    ? "bg-os-accent text-black"
                    : s === step
                    ? "bg-os-surface border border-os-accent text-os-accent"
                    : "bg-os-surface border border-os-border text-os-muted"
                }`}
              >
                {i < stepIdx ? "✓" : i + 1}
              </span>
              <span className="capitalize hidden sm:inline">{s}</span>
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleReset}
          className="text-os-muted text-sm hover:text-os-text transition-colors"
        >
          Start over
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {step === "persona" && (
          <PersonaCard onSelect={handlePersonaSelect} />
        )}
        {step === "brief" && selectedPersona && (
          <BriefForm
            persona={selectedPersona}
            onSubmit={handleBriefSubmit}
            onBack={() => setStep("persona")}
          />
        )}
        {step === "draft" && selectedPersona && briefData && (
          <OutputEditor
            persona={selectedPersona}
            brief={briefData}
            draft={draft}
            onDraftGenerated={handleDraftGenerated}
            onExport={handleExport}
            onBack={() => setStep("brief")}
          />
        )}
        {step === "export" && draft && (
          <ExportPanel
            draft={draft}
            persona={selectedPersona!}
            onBack={() => setStep("draft")}
            onReset={handleReset}
          />
        )}
      </div>
    </main>
  );
}