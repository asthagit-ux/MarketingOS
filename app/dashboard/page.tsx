"use client";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { BriefForm } from "@/components/editor/BriefForm";
import { OutputEditor } from "@/components/editor/OutputEditor";
import { BriefInput, CopyOutput, PersonaType, ToneLevel } from "@/types";
import { PERSONAS } from "@/lib/utils/constants";

function DashboardContent() {
  const params = useSearchParams();
  const persona = (params.get("persona") ?? "solo_founder") as PersonaType;
  const personaConfig = PERSONAS.find((p) => p.id === persona);

  const [output, setOutput] = useState<CopyOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (brief: BriefInput, tone: ToneLevel) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief, tone }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setOutput(json.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center gap-3">
        <span className="text-xl">{personaConfig?.icon}</span>
        <div>
          <h1 className="text-sm font-semibold text-white">MarketingOS</h1>
          <p className="text-xs text-gray-500">{personaConfig?.label}</p>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 border-r border-gray-800 p-6 overflow-y-auto">
          <BriefForm persona={persona} onSubmit={handleGenerate} loading={loading} />
          {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
        </aside>
        <main className="flex-1 p-6 overflow-y-auto">
          <OutputEditor output={output} />
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-600">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
