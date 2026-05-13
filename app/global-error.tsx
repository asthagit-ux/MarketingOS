"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0c0c0e] text-[#f0f0f0] flex flex-col items-center justify-center px-6 font-sans">
        <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
        <p className="text-sm text-[#6b6b80] mb-6 text-center max-w-md">
          An unexpected error occurred. You can try again or return home.
        </p>
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-[#d4f53c] text-black text-sm font-semibold"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
