"use client";

import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";

/**
 * Configures Amplify when amplify_outputs.json exists (after sandbox or deploy).
 * When not configured, the digit recognizer falls back to /api/predict (local Python).
 */
export function AmplifyProvider({ children }: { children: React.ReactNode }) {
  const [configured, setConfigured] = useState(false);
  useEffect(() => {
    import("../../amplify_outputs.json")
      .then((m) => {
        Amplify.configure(m.default ?? m);
        setConfigured(true);
      })
      .catch(() => {
        // No outputs — app still works with /api/predict
      });
  }, []);
  return <>{children}</>;
}
