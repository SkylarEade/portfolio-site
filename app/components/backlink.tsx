// app/components/backlink.tsx
"use client";

export default function BackLink() {
  return (
    <a
      href="/projects"
      style={{
        fontSize: 14,
        color: "#737373",
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 24,
        transition: "color 0.2s",
      }}
      onMouseEnter={(e) =>
        ((e.target as HTMLElement).style.color = "#1a1a1a")
      }
      onMouseLeave={(e) =>
        ((e.target as HTMLElement).style.color = "#737373")
      }
    >
      ← Back to Projects
    </a>
  );
}
