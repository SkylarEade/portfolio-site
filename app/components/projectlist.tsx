// app/components/ProjectList.tsx
"use client";

import { useState, useEffect } from "react";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  tags: string[];
  status: string;
  github: string | null;
  live_url: string | null;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 150 * index);
    return () => clearTimeout(t);
  }, [index]);

  const statusColor =
    project.status === "Live"
      ? "#16a34a"
      : project.status === "In Progress"
      ? "#d97706"
      : "#737373";

  return (
    <a
      href={`/projects/${project.slug}`}
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        padding: "28px 20px",
        borderBottom: "1px solid #e5e5e5",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition:
          "opacity 0.5s ease, transform 0.5s ease, background 0.2s ease",
        margin: "0 -20px",
        borderRadius: 4,
        background: hovered ? "#f5f5f4" : "transparent",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 40,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: 13,
                color: "#737373",
              }}
            >
              {project.id}
            </span>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#1a1a1a",
                margin: 0,
              }}
            >
              {project.title}
            </h3>
          </div>
          <p
            style={{
              fontSize: 14,
              color: "#737373",
              lineHeight: 1.6,
              margin: 0,
              maxWidth: 560,
            }}
          >
            {project.description}
          </p>
          <div
            style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}
          >
            {project.tags.map((tag) => (
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
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
            paddingTop: 4,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: 12,
              color: statusColor,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: statusColor,
                display: "inline-block",
              }}
            />
            {project.status}
          </span>
          <span
            style={{
              color: "#737373",
              transition: "transform 0.2s",
              transform: hovered ? "translateX(4px)" : "translateX(0)",
              fontSize: 18,
            }}
          >
            →
          </span>
        </div>
      </div>
    </a>
  );
}

export default function ProjectList({ projects }: { projects: Project[] }) {
  if (!projects || projects.length === 0) {
    return (
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px 80px" }}>
        <p style={{ color: "#737373", fontSize: 14 }}>Loading projects...</p>
      </section>
    );
  }

  return (
    <section style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px 80px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 12,
        }}
      >
        <h2
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#737373",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Selected Projects
        </h2>
        <a
          href="/projects"
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
          View all →
        </a>
      </div>
      <div>
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}