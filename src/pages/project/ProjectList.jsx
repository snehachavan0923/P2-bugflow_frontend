import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FolderKanban, Plus, Sparkles } from "lucide-react";
import { getProjects, createProject } from "../../api/projectApi";
import CreateProjectModal from "../../components/project/CreateProjectModal";
import { useAuth } from "../../context/AuthContext";
import LoaderWithMessage from "../../components/common/LoaderWithMessage";

const ProjectList = () => {
  const { role } = useAuth();

  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (newProject) => {
    try {
      const saved = await createProject(newProject);

      setProjects((prev) => [...prev, saved]);

      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.24)] backdrop-blur sm:flex-row sm:items-end sm:justify-between sm:p-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              <Sparkles className="h-4 w-4" />
              Project portfolio
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Projects
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Keep delivery, planning, and collaboration organized in one polished workspace.
            </p>
          </div>

          {role === "Owner" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-100 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Create Project
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <LoaderWithMessage message="Loading projects..." />
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-[32px] border border-slate-200 bg-white px-8 py-16 text-center shadow-[0_20px_60px_-28px_rgba(15,23,42,0.16)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-600">
              <FolderKanban className="h-8 w-8" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-slate-950">
              No projects yet
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
              Create your first project to start organizing initiatives and team delivery.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, index) => {
              const initial = (project.name?.charAt(0) || "P").toUpperCase();
              const accentStyles = index % 3 === 0
                ? "bg-blue-50 text-blue-700"
                : index % 3 === 1
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-sky-50 text-sky-700";

              return (
                <div
                  key={project.id}
                  className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_-24px_rgba(15,23,42,0.28)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentStyles}`}>
                      <span className="text-lg font-semibold">{initial}</span>
                    </div>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Active
                    </span>
                  </div>

                  <h2 className="mt-6 text-xl font-semibold text-slate-950">
                    {project.name}
                  </h2>

                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">
                    {project.description || "No project description provided yet."}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
                    <div className="text-sm text-slate-500">Ready for review</div>
                    <Link
                      to={`/projects/${project.id}`}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3.5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-slate-800"
                    >
                      View Project
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {role === "Owner" && isModalOpen && (
          <CreateProjectModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreate={handleCreate}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectList;
