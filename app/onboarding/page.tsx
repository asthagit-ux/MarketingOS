"use client";
import { PersonaCard } from "@/components/persona/PersonaCard";
import { PERSONAS } from "@/lib/utils/constants";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-3xl font-bold mb-2 text-white">Who are you building for?</h1>
      <p className="text-gray-400 mb-10">Choose your persona to tailor the experience.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        {PERSONAS.map((p) => (
          <PersonaCard key={p.id} persona={p} />
        ))}
      </div>
    </main>
  );
}
