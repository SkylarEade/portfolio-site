// app/components/projectbuttons.tsx
"use client";

interface ProjectButtonsProps {
  github?: string | null;
  live_url?: string | null;
}

export default function ProjectButtons({ github, live_url }: ProjectButtonsProps) {
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
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
          View on GitHub ↗
        </a>
      )}
      {live_url && (
        <a
          href={live_url}
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
          Visit Live Site ↗
        </a>
      )}
    </div>
  );
}
