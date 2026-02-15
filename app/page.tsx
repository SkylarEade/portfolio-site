// app/page.tsx
// This is a Next.js App Router server component that fetches projects from S3

import ProjectList from "./components/ProjectList";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

// Replace this with your actual S3 bucket URL after setup
const PROJECTS_URL =
  "https://YOUR-BUCKET-NAME.s3.YOUR-REGION.amazonaws.com/projects.json";

async function getProjects() {
  try {
    const res = await fetch(PROJECTS_URL, {
      next: { revalidate: 60 }, // re-fetch every 60 seconds (ISR)
    });
    if (!res.ok) throw new Error("Failed to fetch projects");
    const data = await res.json();
    return data.projects;
  } catch (error) {
    console.error("Error loading projects:", error);
    return [];
  }
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <div
      style={{
        background: "#fafaf9",
        minHeight: "100vh",
        color: "#1a1a1a",
      }}
    >
      <Nav />
      <Hero />

      {/* Divider */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ borderTop: "1px solid #e5e5e5" }} />
      </div>

      <ProjectList projects={projects} />
      <Footer />
    </div>
  );
}
