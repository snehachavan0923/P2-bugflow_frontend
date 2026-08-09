import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  FolderKanban,
  Eye,
  X,
  Sparkles,
  AlertCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  getOrganizationIssues,
} from "../../api/issueApi";
import LoaderWithMessage from "../../components/common/LoaderWithMessage";

const TaskOverview = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [detailsIssue, setDetailsIssue] = useState(null);

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const data = await getOrganizationIssues();
        setIssues(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadIssues();
  }, []);

  const projects = useMemo(() => {
    return [
      "All",
      ...new Set(issues.map((issue) => issue.projectName)),
    ];
  }, [issues]);

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchesSearch = issue.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesProject =
        projectFilter === "All" || issue.projectName === projectFilter;

      const matchesStatus =
        statusFilter === "All" || issue.status === statusFilter;

      return matchesSearch && matchesProject && matchesStatus;
    });
  }, [issues, search, projectFilter, statusFilter]);

  const openCount = issues.filter((i) => i.status === "Open").length;
  const reviewCount = issues.filter((i) => i.status === "Review").length;
  const doneCount = issues.filter((i) => i.status === "Done").length;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <LoaderWithMessage message="Loading task overview..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Hero Header Section */}
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.22)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                <Sparkles className="h-4 w-4" />
                Issue tracking & operations
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Task Overview
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Track, filter, and inspect issues across all organization projects in a clean enterprise workspace.
              </p>
            </div>
          </div>

          {/* Dashboard Summary Metric Cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:border-slate-300 hover:bg-slate-100/50">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-100 p-2.5 text-indigo-700">
                  <FolderKanban className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Issues</p>
                  <p className="text-2xl font-semibold text-slate-950">{issues.length}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:border-slate-300 hover:bg-slate-100/50">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-100 p-2.5 text-blue-700">
                  <AlertCircle className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Open Issues</p>
                  <p className="text-2xl font-semibold text-slate-950">{openCount}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:border-slate-300 hover:bg-slate-100/50">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-amber-100 p-2.5 text-amber-700">
                  <Clock className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">In Review</p>
                  <p className="text-2xl font-semibold text-slate-950">{reviewCount}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:border-slate-300 hover:bg-slate-100/50">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-100 p-2.5 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Done Issues</p>
                  <p className="text-2xl font-semibold text-slate-950">{doneCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Control Panel Section */}
        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.12)] sm:p-5">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search issues by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50/80 placeholder:text-slate-400"
              />
            </div>

            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50/80"
            >
              {projects.map((project) => (
                <option key={project} value={project}>
                  {project === "All" ? "All Projects" : project}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50/80"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>

        {/* Issues Table Container */}
        <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.18)] sm:p-6">
          {issues.length === 0 ? (
            <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-[24px] border border-slate-200 bg-slate-50 p-10 text-center shadow-sm my-4">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 text-indigo-600 shadow-sm">
                <FolderKanban className="h-7 w-7" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-slate-950">
                No issues found
              </h2>
              <p className="mt-2.5 text-sm leading-6 text-slate-600">
                Issues created across organization projects will appear here.
              </p>
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-[24px] border border-slate-200 bg-slate-50 p-10 text-center shadow-sm my-4">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 text-indigo-600 shadow-sm">
                <Search className="h-7 w-7" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-slate-950">
                No matching issues
              </h2>
              <p className="mt-2.5 text-sm leading-6 text-slate-600">
                Try adjusting your search query or filters.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead className="bg-slate-50/80">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                        Project
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                        Priority
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                        Assigned
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 bg-white">
                    {filteredIssues.map((issue) => (
                      <tr
                        key={issue.id}
                        className="transition-colors hover:bg-slate-50/80"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-2.5 font-semibold text-slate-950">
                            <div className="rounded-xl bg-indigo-50 p-1.5 text-indigo-600">
                              <FolderKanban className="h-4 w-4" />
                            </div>
                            {issue.projectName}
                          </div>
                        </td>

                        <td className="max-w-xs truncate px-6 py-4 font-medium text-slate-900">
                          {issue.title}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${issue.priority === "HIGH" ||
                                issue.priority === "High"
                                ? "border-rose-200/60 bg-rose-50 text-rose-700"
                                : issue.priority === "MEDIUM" ||
                                  issue.priority === "Medium"
                                  ? "border-amber-200/60 bg-amber-50 text-amber-700"
                                  : "border-slate-200/60 bg-slate-100 text-slate-700"
                              }`}
                          >
                            {issue.priority}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-indigo-100 text-xs font-bold text-indigo-700 shadow-sm">
                              {(
                                issue.assignedToName?.charAt(0) || "U"
                              ).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-950">
                                {issue.assignedToName || "Unassigned"}
                              </p>
                              <p className="text-xs font-medium text-slate-500">
                                {issue.assignedToRole || "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${issue.status === "Done"
                                ? "border-emerald-200/60 bg-emerald-50 text-emerald-700"
                                : issue.status === "Review"
                                  ? "border-amber-200/60 bg-amber-50 text-amber-700"
                                  : issue.status === "In Progress"
                                    ? "border-indigo-200/60 bg-indigo-50 text-indigo-700"
                                    : "border-blue-200/60 bg-blue-50 text-blue-700"
                              }`}
                          >
                            {issue.status}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4">
                          <button
                            onClick={() => setDetailsIssue(issue)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-indigo-600"
                          >
                            <Eye className="h-4 w-4 text-slate-400" />
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {detailsIssue && (
            <Dialog
              title="Issue Details"
              onClose={() => setDetailsIssue(null)}
            >
              <DetailsContent issue={detailsIssue} />
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

const Dialog = ({ title, children, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4"
    onClick={onClose}
  >
    <div
      className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl sm:p-8"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-indigo-100/80 bg-indigo-50 p-2.5 text-indigo-700">
            <FolderKanban className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
            <p className="text-xs font-medium text-slate-500">
              Detailed breakdown of issue parameters
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="pt-6">{children}</div>
    </div>
  </div>
);

const DetailsContent = ({ issue }) => (
  <div className="space-y-6">
    <div className="grid gap-3 sm:grid-cols-2">
      {[
        ["Project", issue.projectName],
        ["Title", issue.title],
        ["Status", issue.status],
        ["Priority", issue.priority],
        ["Assigned To", issue.assignedToName],
        ["Role", issue.assignedToRole],
        ["Email", issue.assignedToEmail],
      ].map(([label, value]) => (
        <div
          key={label}
          className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 transition-all duration-200 hover:border-slate-300"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </p>
          <p className="mt-1.5 break-words text-sm font-semibold text-slate-950">
            {value || "N/A"}
          </p>
        </div>
      ))}
    </div>

    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Description
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-700 whitespace-pre-wrap">
        {issue.description || "No description provided."}
      </p>
    </div>

    {issue.imageUrl && (
      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Bug Image Attachment
        </p>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2">
          <img
            src={issue.imageUrl}
            alt="Bug attachment"
            className="max-h-72 w-full object-contain rounded-xl"
          />
        </div>
      </div>
    )}

    {issue.resolutionImageUrl && (
      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Resolution Proof Attachment
        </p>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2">
          <img
            src={issue.resolutionImageUrl}
            alt="Resolution proof"
            className="max-h-72 w-full object-contain rounded-xl"
          />
        </div>
      </div>
    )}
  </div>
);

export default TaskOverview;