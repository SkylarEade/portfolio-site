// app/components/Nav.tsx
"use client";

export default function Nav() {
  return (
    <nav
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "32px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <a
        href="/"
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 15,
          fontWeight: 500,
          color: "#1a1a1a",
          textDecoration: "none",
          letterSpacing: "-0.01em",
        }}
      >
        skylar eade
      </a>
      <div style={{ display: "flex", gap: 28 }}>
        {["Projects", "About", "Contact"].map((item) => (
          <a
            key={item}
            href={`/${item.toLowerCase()}`}
            style={{
              color: "#737373",
              textDecoration: "none",
              fontSize: 14,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.color = "#1a1a1a")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.color = "#737373")
            }
          >
            {item}
          </a>
        ))}
      </div>
    </nav>
  );
}