// app/projects/handwritten-digit-recognizer/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Nav from "../../components/nav";
import Footer from "../../components/footer";
import type { Schema } from "../../../amplify/data/resource";

// When hosted on AWS Amplify, prediction runs in a Python Lambda (your AI Basics model).
// Locally, use /api/predict (runs Python on your machine).
const PREDICT_API = "/api/predict";

const CANVAS_SIZE = 280;
const GRID_SIZE = 28;

export default function DigitRecognizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [confidences, setConfidences] = useState<number[]>(new Array(10).fill(0));
  const [hasDrawn, setHasDrawn] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 18;
  }, []);

  const getPos = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    },
    []
  );

  const startDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) return;
      setIsDrawing(true);
      setHasDrawn(true);
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    },
    [getPos]
  );

  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) return;
      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    },
    [isDrawing, getPos]
  );

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    setPrediction(null);
    setConfidences(new Array(10).fill(0));
    setHasDrawn(false);
    setError(null);
  }, []);

  const predict = useCallback(async () => {
    if (!canvasRef.current) return;

    const offscreen = document.createElement("canvas");
    offscreen.width = GRID_SIZE;
    offscreen.height = GRID_SIZE;
    const offCtx = offscreen.getContext("2d");
    if (!offCtx) return;

    offCtx.drawImage(canvasRef.current, 0, 0, GRID_SIZE, GRID_SIZE);
    const imageData = offCtx.getImageData(0, 0, GRID_SIZE, GRID_SIZE);

    const pixels: number[] = [];
    for (let i = 0; i < imageData.data.length; i += 4) {
      pixels.push(imageData.data[i] / 255);
    }

    setPredicting(true);
    setError(null);
    try {
      let data: { prediction?: number; confidences?: number[]; error?: string };
      try {
        const { generateClient } = await import("aws-amplify/data");
        const client = generateClient<Schema>({ authMode: "apiKey" });
        const result = await client.queries.predictDigit({
          pixelsJson: JSON.stringify(pixels),
        });
        const jsonStr = result.data ?? "{}";
        data = JSON.parse(typeof jsonStr === "string" ? jsonStr : JSON.stringify(jsonStr));
      } catch {
        const res = await fetch(PREDICT_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pixels }),
        });
        data = await res.json();
        if (!res.ok) {
          setError((data as { error?: string }).error || `Request failed: ${res.status}`);
          setPredicting(false);
          return;
        }
      }
      if ((data as { error?: string }).error) {
        setError((data as { error?: string }).error ?? "Prediction failed");
        return;
      }
      setPrediction(data.prediction ?? 0);
      setConfidences(Array.isArray(data.confidences) ? data.confidences : new Array(10).fill(0));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setPredicting(false);
    }
  }, []);

  const maxConfidence = Math.max(...confidences);

  return (
    <div style={{ background: "#fafaf9", minHeight: "100vh", color: "#1a1a1a", width: "100%", overflowX: "hidden" }}>
      <Nav />

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
        <a
          href="/projects"
          style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: 13,
            color: "#737373",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 24,
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#1a1a1a")}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#737373")}
        >
          ← Back to Projects
        </a>

        <h1
          style={{
            fontSize: "clamp(28px, 4vw, 36px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            marginBottom: 12,
          }}
        >
          Handwritten Digit Recognizer
        </h1>
        <p style={{ fontSize: 15, color: "#737373", lineHeight: 1.7, maxWidth: 560, marginBottom: 8 }}>
          Draw a number (0–9). The prediction is made by your AI Basics model (Python + NumPy) running on the server.
        </p>
        <div style={{ display: "flex", gap: 6, marginBottom: 40, flexWrap: "wrap" }}>
          {["Python", "NumPy", "JavaScript", "From Scratch"].map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: 12,
                color: "#737373",
                background: "#f0f0ee",
                padding: "4px 10px",
                borderRadius: 4,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", gap: 40, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div>
            <div
              style={{
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: 12,
                color: "#737373",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 12,
              }}
            >
              Draw here
            </div>
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 8,
                cursor: "crosshair",
                touchAction: "none",
                display: "block",
              }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button
                onClick={predict}
                disabled={!hasDrawn || predicting}
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: hasDrawn && !predicting ? "#fff" : "#a3a3a3",
                  background: hasDrawn && !predicting ? "#18181b" : "#e5e5e5",
                  border: "none",
                  padding: "10px 24px",
                  borderRadius: 6,
                  cursor: hasDrawn && !predicting ? "pointer" : "default",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (hasDrawn && !predicting) (e.target as HTMLElement).style.opacity = "0.85";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.opacity = "1";
                }}
              >
                {predicting ? "Predicting…" : "Predict"}
              </button>
              <button
                onClick={clearCanvas}
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#1a1a1a",
                  background: "transparent",
                  border: "1px solid #e5e5e5",
                  padding: "10px 24px",
                  borderRadius: 6,
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.background = "#f5f5f4")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.background = "transparent")
                }
              >
                Clear
              </button>
            </div>
            {error && (
              <p style={{ marginTop: 12, fontSize: 13, color: "#dc2626" }}>
                {error}
              </p>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 220 }}>
            <div
              style={{
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: 12,
                color: "#737373",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 12,
              }}
            >
              Prediction
            </div>

            {prediction !== null ? (
              <>
                <div
                  style={{
                    fontSize: 72,
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {prediction}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontSize: 13,
                    color: "#737373",
                    marginBottom: 32,
                  }}
                >
                  {(maxConfidence * 100).toFixed(1)}% confidence
                </div>

                <div
                  style={{
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontSize: 12,
                    color: "#737373",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 12,
                  }}
                >
                  All outputs
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {confidences.map((conf, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-dm-mono), monospace",
                          fontSize: 13,
                          color: i === prediction ? "#1a1a1a" : "#a3a3a3",
                          fontWeight: i === prediction ? 600 : 400,
                          width: 14,
                          textAlign: "right",
                        }}
                      >
                        {i}
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: 20,
                          background: "#f0f0ee",
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${(conf * 100).toFixed(1)}%`,
                            background: i === prediction ? "#18181b" : "#c4c4c2",
                            borderRadius: 4,
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-dm-mono), monospace",
                          fontSize: 12,
                          color: i === prediction ? "#1a1a1a" : "#a3a3a3",
                          width: 48,
                          textAlign: "right",
                        }}
                      >
                        {(conf * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div
                style={{
                  color: "#a3a3a3",
                  fontSize: 14,
                  lineHeight: 1.7,
                  padding: "40px 0",
                }}
              >
                Draw a digit and click Predict. Your Python model on the server will run the forward pass.
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            marginTop: 60,
            paddingTop: 40,
            borderTop: "1px solid #e5e5e5",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: 12,
              color: "#737373",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 20,
            }}
          >
            How it works
          </h2>
          <p style={{ fontSize: 14, color: "#737373", lineHeight: 1.7, maxWidth: 560 }}>
            You draw on the canvas. The app sends the 28×28 pixel data to the server. The server runs your{" "}
            <strong>AI Basics</strong> Python code (same <code>main.py</code> and <code>mnist_model.npz</code> from the repo),
            runs one forward pass, and returns the predicted digit. No duplicate logic in JavaScript — it’s your real project.
          </p>
        </div>

        <div style={{ marginTop: 40 }}>
          <a
            href="https://github.com/SkylarEade/AIBasics"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "#1a1a1a",
              background: "transparent",
              padding: "10px 22px",
              borderRadius: 6,
              textDecoration: "none",
              border: "1px solid #e5e5e5",
              display: "inline-block",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.background = "#f5f5f4")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.background = "transparent")
            }
          >
            View Source on GitHub ↗
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
