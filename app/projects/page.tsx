// app/projects/page.tsx
import ProjectList from "../components/projectlist";
import Nav from "../components/nav";
import Footer from "../components/footer";
import fs from "fs";
import path from "path";

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

export default async function ProjectsPage() {
  const projects = await getProjects();

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
      <ProjectList projects={projects} />
      <Footer />
    </div>
  );
}
