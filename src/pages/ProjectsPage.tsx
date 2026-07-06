import { useState } from "react";
import { LogIn, Plus } from "lucide-react";
import { motion } from "framer-motion";

import { formatRelativeDate } from "../utils/formatRelativeDate";

import ProjectCard from "../components/project/ProjectCard";
import CreateProjectSheet from "../components/CreateProjectSheet";
import JoinProjectSheet from "../components/JoinProjectSheet";
import RenameSheet from "../components/RenameSheet";
import ConfirmSheet from "../components/ConfirmSheet";

import { useAudio } from "../context/AudioContext";
import { useProjects } from "../hooks/useProjects";

import {
  deleteProject,
  joinProjectByInviteCode,
  renameProject,
  type Project,
} from "../services/projectService";

export default function ProjectsPage() {
  const {
    projects,
    addProject,
    loading,
    refresh,
  } = useProjects();

  const { currentSong } = useAudio();

  const [sheetOpen, setSheetOpen] =
    useState(false);

  const [joinOpen, setJoinOpen] =
    useState(false);

  const [projectName, setProjectName] =
    useState("");

  const [joinCode, setJoinCode] =
    useState("");

  const [joining, setJoining] =
    useState(false);

  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const [renameOpen, setRenameOpen] =
    useState(false);

  const [renameValue, setRenameValue] =
    useState("");

  const [confirmOpen, setConfirmOpen] =
    useState(false);

  async function create() {
    if (!projectName.trim()) return;

    try {
      await addProject(projectName.trim());

      setProjectName("");
      setSheetOpen(false);
    } catch (err: unknown) {
      console.error(err);

      alert(
        err instanceof Error
          ? err.message
          : "Unknown error"
      );
    }
  }

  async function join() {
    if (!joinCode.trim()) return;

    setJoining(true);

    try {
      await joinProjectByInviteCode(joinCode);
      await refresh();

      setJoinCode("");
      setJoinOpen(false);
    } catch (err: unknown) {
      console.error(err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to join project."
      );
    } finally {
      setJoining(false);
    }
  }

  const totalSongs = projects.reduce(
    (sum, project) =>
      sum + (project.songs?.[0]?.count ?? 0),
    0
  );

  return (
    <main className="min-h-screen bg-[#08090D] px-6 pt-16 pb-36">

      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
          Demos
        </p>

        <div className="mt-3 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-5xl font-black text-white">
            WORKSPACE
            </h1>

            <p className="mt-3 max-w-2xl text-zinc-400">
              create and collaborate
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-64">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="text-3xl font-black text-white">
                {projects.length}
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Projects
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="text-3xl font-black text-white">
                {totalSongs}
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Demos
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-white">
            Your projects
          </h2>

          <button
            onClick={() => setJoinOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            <LogIn size={18} />
            Join
          </button>
        </div>

      {loading ? (
        <p className="text-zinc-500">
          Loading...
        </p>
      ) : projects.length === 0 ? (
        <div className="mt-16 rounded-lg border border-dashed border-white/15 bg-white/[0.03] px-6 py-16 text-center">
          <h3 className="text-2xl font-bold text-white">
            No projects yet
          </h3>

          <p className="mt-3 text-zinc-500">
            Create a project for an EP, rehearsal batch, or songwriting session.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.name}
              songs={project.songs?.[0]?.count ?? 0}
              members={1}
              updated={formatRelativeDate(project.created_at)}
              colors="from-sky-500 via-blue-600 to-indigo-700"
              coverPath={project.cover_path}
              index={index}
              onRename={() => {
                setSelectedProject(project);
                setRenameValue(project.name);
                setRenameOpen(true);
              }}
              onDelete={() => {
                setSelectedProject(project);
                setConfirmOpen(true);
              }}
            />
          ))}
        </div>
      )}
      </section>

      <motion.button
        animate={{
          scale: sheetOpen ? 0 : 1,
          opacity: sheetOpen ? 0 : 1,
          y: sheetOpen ? 80 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 25,
        }}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setSheetOpen(true)}
        className={`fixed right-6 transition-all duration-500 ease-out ${
          currentSong
            ? "bottom-28"
            : "bottom-10"
        } flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 shadow-[0_0_40px_rgba(59,130,246,.45)]`}
        aria-label="Create project"
      >
        <Plus
          className="text-white"
          size={30}
        />
      </motion.button>

      <CreateProjectSheet
        open={sheetOpen}
        value={projectName}
        onChange={setProjectName}
        onClose={() => {
          setSheetOpen(false);
          setProjectName("");
        }}
        onCreate={create}
      />

      <JoinProjectSheet
        open={joinOpen}
        value={joinCode}
        loading={joining}
        onChange={setJoinCode}
        onClose={() => {
          setJoinOpen(false);
          setJoinCode("");
        }}
        onJoin={join}
      />

      <RenameSheet
        open={renameOpen}
        title="Rename Project"
        value={renameValue}
        onChange={setRenameValue}
        onClose={() => {
          setRenameOpen(false);
        }}
        onSave={async () => {
          if (!selectedProject) return;

          try {
            await renameProject(
              selectedProject.id,
              renameValue.trim()
            );

            await refresh();

            setRenameOpen(false);
            setSelectedProject(null);
          } catch (err) {
            console.error(err);

            alert(
              "Failed to rename project."
            );
          }
        }}
      />

      <ConfirmSheet
        open={confirmOpen}
        title="Delete Project?"
        description="This will permanently delete the project, artwork, and every song."
        confirmText="Delete"
        onClose={() => {
          setConfirmOpen(false);
          setSelectedProject(null);
        }}
        onConfirm={async () => {
          if (!selectedProject) return;

          try {
            await deleteProject(
              selectedProject
            );

            await refresh();

            setConfirmOpen(false);
            setSelectedProject(null);
          } catch (err) {
            console.error(err);

            alert(
              "Failed to delete project."
            );
          }
        }}
      />

    </main>
  );
}
