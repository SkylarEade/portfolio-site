// app/components/Hero.tsx
"use client";

import { useState, useEffect } from "react";

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "64px 24px 80px",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(12px)",
        transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(32px, 5vw, 44px)",
          fontWeight: 700,
          color: "#1a1a1a",
          lineHeight: 1.2,
          letterSpacing: "-0.03em",
          marginBottom: 20,
        }}
      >
        Software Engineer
      </h1>
      <p
        style={{
          fontSize: 17,
          color: "#737373",
          lineHeight: 1.7,
          maxWidth: 520,
        }}
      >
        I love developing software in the field of quantitative finance and machine learning.
      </p>
      <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
        <a
          href="/projects"
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#fff",
            background: "#18181b",
            padding: "10px 22px",
            borderRadius: 6,
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLElement).style.opacity = "0.85")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLElement).style.opacity = "1")
          }
        >
          View Projects
        </a>
        <a
          href="https://github.com/skylareade"
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
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLElement).style.background = "#f5f5f4")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLElement).style.background = "transparent")
          }
        >
          GitHub ↗
        </a>
      </div>
    </section>
  );
}