import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
  CalendarDays,
  Users,
  Building2,
  UserRound,
} from "lucide-react";
import LoaderWithMessage from "../../components/common/LoaderWithMessage";
import {
  getAdminProjects,
  getAdminProjectById,
} from "../../api/adminProjectApi";

const PAGE_SIZE = 8;

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setError("");
        setLoading(true);
        const data = await getAdminProjects();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || "Unable to load projects.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return projects.filter((project) => {
      const projectName = project.projectName?.toLowerCase() || "";
      const organizationName = project.organizationName?.toLowerCase() || "";
      const ownerName = project.ownerName?.toLowerCase() || "";
      const status = project.status?.toLowerCase() || "";

      return (
        !query ||
        projectName.includes(query) ||
        organizationName.includes(query) ||
        ownerName.includes(query) ||
        status.includes(query)
      );
    });
  }, [projects, searchTerm]);

  const pageCount = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE));

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  const currentProjects = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProjects.slice(start, start + PAGE_SIZE);
  }, [filteredProjects, page]);

  const formatDate = (value) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const openDetails = async (projectId) => {
    try {
      setError("");
      const data = await getAdminProjectById(projectId);
      setSelectedProject(data);
      setDetailsOpen(true);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Unable to load project details.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Platform Monitoring
            </p>
            <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">
              Project Management
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Monitor your platform projects, review project health, and inspect project ownership.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-80">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setPage(1);
                }}
                placeholder="Search project, organization, owner, or status"
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <LoaderWithMessage message="Loading projects..." />
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-red-50 p-3 text-red-600">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Unable to load projects</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{error}</p>
              </div>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Search className="h-8 w-8" />
            </div>
            <h2 className="mt-6 text-xl font-semibold text-slate-950">No projects found</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              No projects match your search. Try searching by project name, organization, owner name, or status.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Project
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Organization
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Owner
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Issues
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Members
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {currentProjects.map((project) => (
                    <tr key={project.projectId} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-950">
                        {project.projectName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                        {project.organizationName || 'Unknown'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                        {project.ownerName || 'Unknown'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            project.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-900">
                        {project.totalIssues}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-900">
                        {project.totalMembers}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        {formatDate(project.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium space-x-2">
                        <button
                          type="button"
                          onClick={() => openDetails(project.projectId)}
                          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          <Eye className="inline h-4 w-4 mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Showing {currentProjects.length} of {filteredProjects.length} projects
              </p>
              <div className="inline-flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-slate-700">Page {page} of {pageCount}</span>
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
                  disabled={page === pageCount}
                  className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {detailsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[1px]"
          onClick={() => {
            setDetailsOpen(false);
            setSelectedProject(null);
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 sm:px-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
                  Project details
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-950">View Project</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDetailsOpen(false);
                  setSelectedProject(null);
                }}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {selectedProject ? (
              <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Project</p>
                      <h3 className="mt-2 text-2xl font-semibold text-slate-950">{selectedProject.projectName}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Review project access, organization ownership, and project statistics.
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        selectedProject.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {selectedProject.status}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-indigo-50 p-2.5 text-indigo-600">
                        <UserRound className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Owner Name</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{selectedProject.ownerName || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-sky-50 p-2.5 text-sky-600">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Organization</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{selectedProject.organizationName || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <CalendarDays className="h-4 w-4" />
                      <p className="text-xs font-semibold uppercase tracking-[0.24em]">Created Date</p>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-slate-950">{formatDate(selectedProject.createdAt)}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Building2 className="h-4 w-4" />
                      <p className="text-xs font-semibold uppercase tracking-[0.24em]">Total Issues</p>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-slate-950">{selectedProject.totalIssues}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Users className="h-4 w-4" />
                      <p className="text-xs font-semibold uppercase tracking-[0.24em]">Total Members</p>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-slate-950">{selectedProject.totalMembers}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-10">
                <div className="flex flex-col items-center gap-4">
               
                  <LoaderWithMessage message="Loading project details..." />
                </div>
              </div>
            )}

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
              <button
                type="button"
                onClick={() => {
                  setDetailsOpen(false);
                  setSelectedProject(null);
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
