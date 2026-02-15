// app/projects/[slug]/page.tsx
import Nav from "../../components/nav";
import Footer from "../../components/footer";
import BackLink from "../../components/backlink";
import ProjectButtons from "../../components/projectbuttons";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";

async function getProjects() {
  try {
    const filePath = path.join(process.cwd(), "projects.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);
    return data.projects || [];
  } catch (error) {
    console.error("Error loading projects:", error);
    return [];
  }
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const projects = await getProjects();
  const project = projects.find((p: any) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  const statusColor =
    project.status === "Live"
      ? "#16a34a"
      : project.status === "In Progress"
      ? "#d97706"
      : "#737373";

  return (
    <div
      style={{
        background: "#fafaf9",
        minHeight: "100vh",
        color: "#1a1a1a",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <Nav />
      <article
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "64px 24px 80px",
        }}
      >
        <div style={{ marginBottom: 40 }}>
          <BackLink />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
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
            <h1
              style={{
                fontSize: "clamp(28px, 4vw, 36px)",
                fontWeight: 700,
                color: "#1a1a1a",
                margin: 0,
              }}
            >
              {project.title}
            </h1>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
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
            {project.tags.map((tag: string) => (
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
            fontSize: 16,
            color: "#1a1a1a",
            lineHeight: 1.7,
            marginBottom: 32,
          }}
        >
          <p style={{ marginBottom: 16 }}>{project.description}</p>
        </div>
        <ProjectButtons github={project.github} live_url={project.live_url} />
      </article>
      <Footer />
    </div>
  );
}
