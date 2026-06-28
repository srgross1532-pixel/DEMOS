import { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

import ProjectCard from "../components/project/ProjectCard";
import CreateProjectSheet from "../components/CreateProjectSheet";
import { useProjects } from "../hooks/useProjects";

export default function ProjectsPage() {
  const { projects, addProject, loading } = useProjects();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [projectName, setProjectName] = useState("");

  async function create() {
    if (!projectName.trim()) return;

    await addProject(projectName);

    setProjectName("");
    setSheetOpen(false);
  }

  return (
    <main className="min-h-screen bg-[#08090D] px-6 pt-16 pb-36">
      <p className="text-zinc-500">
        Good afternoon
      </p>

      <h1 className="mt-1 text-5xl font-black text-white">
        Sam 👋
      </h1>

      <h2 className="mt-10 mb-6 text-2xl font-bold text-white">
        Your Projects
      </h2>

      {loading ? (
        <p className="text-zinc-500">
          Loading...
        </p>
      ) : projects.length === 0 ? (
        <div className="mt-24 text-center">
          <h3 className="text-2xl font-bold text-white">
            No Projects Yet
          </h3>

          <p className="mt-3 text-zinc-500">
            Tap the + button to create your first project.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              title={project.name}
              songs={0}
              members={1}
              updated="Just now"
              colors="from-sky-500 via-blue-600 to-indigo-700"
              index={index}
            />
          ))}
        </div>
      )}

      {!sheetOpen && (
  <motion.button
    whileTap={{ scale: 0.9 }}
    whileHover={{ scale: 1.05 }}
    onClick={() => setSheetOpen(true)}
    className="fixed bottom-28 right-6 z-20 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 shadow-[0_0_40px_rgba(59,130,246,.45)]"
  >
    <Plus className="text-white" size={30} />
  </motion.button>
)}

      <CreateProjectSheet
        open={sheetOpen}
        value={projectName}
        onChange={setProjectName}
        onClose={() => setSheetOpen(false)}
        onCreate={create}
      />
    </main>
  );
}
