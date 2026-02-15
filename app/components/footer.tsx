// app/components/Footer.tsx
"use client";

export default function Footer() {
  return (
    <footer
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "24px 24px 48px",
        borderTop: "1px solid #e5e5e5",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 12,
          color: "#737373",
        }}
      >
        © 2025 Skylar Eade
      </span>
      <div style={{ display: "flex", gap: 20 }}>
        {[
          { label: "GitHub", href: "https://github.com/skylareade" },
          { label: "LinkedIn", href: "https://linkedin.com/in/skylareade" },
          { label: "Email", href: "mailto:skylar@skylareade.com" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.label !== "Email" ? "_blank" : undefined}
            rel={link.label !== "Email" ? "noopener noreferrer" : undefined}
            style={{
              fontSize: 13,
              color: "#737373",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.color = "#1a1a1a")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.color = "#737373")
            }
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}