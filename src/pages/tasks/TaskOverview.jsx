import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  FolderKanban,
  Loader2,
  Eye,
  X,
} from "lucide-react";
import {
  getOrganizationIssues,
} from "../../api/issueApi";

const TaskOverview = () => {

  const [issues, setIssues] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [projectFilter, setProjectFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [detailsIssue, setDetailsIssue] =
  useState(null);

  useEffect(() => {

    const loadIssues = async () => {

      try {

        const data =
          await getOrganizationIssues();

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
      ...new Set(
        issues.map(
          issue => issue.projectName
        )
      )
    ];

  }, [issues]);

  const filteredIssues = useMemo(() => {

    return issues.filter(issue => {

      const matchesSearch =
        issue.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesProject =
        projectFilter === "All"
        || issue.projectName === projectFilter;

      const matchesStatus =
        statusFilter === "All"
        || issue.status === statusFilter;

      return (
        matchesSearch &&
        matchesProject &&
        matchesStatus
      );
    });

  }, [
    issues,
    search,
    projectFilter,
    statusFilter
  ]);

  const openCount =
    issues.filter(
      i => i.status === "Open"
    ).length;

  const reviewCount =
    issues.filter(
      i => i.status === "Review"
    ).length;

  const doneCount =
    issues.filter(
      i => i.status === "Done"
    ).length;

  if (loading) {

    return (
      <div className="flex justify-center items-center min-h-[60vh]">

        <Loader2
          className="animate-spin"
          size={30}
        />

      </div>
    );
  }

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div>

        <h1 className="text-3xl font-bold text-slate-900">
          Task Overview
        </h1>

        <p className="text-slate-500 mt-1">
          Track all issues across your organization
        </p>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

        <div className="bg-white rounded-2xl shadow-sm border p-5">

          <h3 className="text-sm text-slate-500">
            Total Issues
          </h3>

          <p className="text-3xl font-bold mt-2">
            {issues.length}
          </p>

        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-5">

          <h3 className="text-sm text-slate-500">
            Open
          </h3>

          <p className="text-3xl font-bold text-blue-600 mt-2">
            {openCount}
          </p>

        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-5">

          <h3 className="text-sm text-slate-500">
            Review
          </h3>

          <p className="text-3xl font-bold text-amber-600 mt-2">
            {reviewCount}
          </p>

        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-5">

          <h3 className="text-sm text-slate-500">
            Done
          </h3>

          <p className="text-3xl font-bold text-green-600 mt-2">
            {doneCount}
          </p>

        </div>

      </div>

      {/* FILTERS */}

      <div className="bg-white border rounded-2xl p-5 shadow-sm">

        <div className="grid lg:grid-cols-3 gap-4">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search issue..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full border rounded-xl pl-10 pr-4 py-2"
            />

          </div>

          <select
            value={projectFilter}
            onChange={(e) =>
              setProjectFilter(
                e.target.value
              )
            }
            className="border rounded-xl px-4 py-2"
          >
            {projects.map(project => (
              <option
                key={project}
                value={project}
              >
                {project}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="border rounded-xl px-4 py-2"
          >
            <option>All</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Review</option>
            <option>Done</option>
          </select>

        </div>

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr>

                <th className="text-left px-5 py-4 text-xs uppercase text-slate-500">
                  Project
                </th>

                <th className="text-left px-5 py-4 text-xs uppercase text-slate-500">
                  Title
                </th>

                <th className="text-left px-5 py-4 text-xs uppercase text-slate-500">
                  Priority
                </th>

                <th className="text-left px-5 py-4 text-xs uppercase text-slate-500">
                  Assigned
                </th>

                <th className="text-left px-5 py-4 text-xs uppercase text-slate-500">
                  Status
                </th>

                <th className="text-left px-5 py-4 text-xs uppercase text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredIssues.map(issue => (

                <tr
                  key={issue.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <FolderKanban size={16} />

                      {issue.projectName}

                    </div>

                  </td>

                  <td className="px-5 py-4 font-medium">
                    {issue.title}
                  </td>

                  <td className="px-5 py-4">
                    {issue.priority}
                  </td>

                  <td className="px-5 py-4">

                    <div>
                      <p className="font-medium">
                        {issue.assignedToName}
                      </p>

                      <p className="text-xs text-slate-500">
                        {issue.assignedToRole}
                      </p>
                    </div>

                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        issue.status === "Done"
                          ? "bg-green-100 text-green-700"
                          : issue.status === "Review"
                          ? "bg-amber-100 text-amber-700"
                          : issue.status === "In Progress"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {issue.status}
                    </span>

                  </td>
                  <td className="px-5 py-4">

                    <button
                        onClick={() =>
                        setDetailsIssue(issue)
                        }
                        className="
                        inline-flex
                        items-center
                        gap-2
                        px-3
                        py-2
                        rounded-xl
                        bg-slate-900
                        text-white
                        text-sm
                        hover:bg-slate-800
                        transition
                        "
                    >
                        <Eye size={16} />
                        Details
                    </button>

                    </td>

                </tr>

              ))}

            </tbody>

          </table>
          {detailsIssue && (
        <Dialog
            title="Issue Details"
            onClose={() =>
            setDetailsIssue(null)
            }
        >
            <DetailsContent
            issue={detailsIssue}
            />
        </Dialog>
        )}

        </div>

      </div>

    </div>
  );
};
const Dialog = ({
  title,
  children,
  onClose,
}) => (

  <div
    className="
      fixed inset-0 z-50
      flex items-center justify-center
      bg-black/50 p-4
    "
    onClick={onClose}
  >

    <div
      className="
        bg-white rounded-2xl shadow-xl
        w-full max-w-2xl
        max-h-[90vh]
        overflow-y-auto
      "
      onClick={(e) =>
        e.stopPropagation()
      }
    >

      <div
        className="
          flex items-center justify-between
          border-b p-5
        "
      >

        <h2 className="text-xl font-bold">
          {title}
        </h2>

        <button
          onClick={onClose}
        >
          <X size={20} />
        </button>

      </div>

      <div className="p-5">
        {children}
      </div>

    </div>

  </div>
);

const DetailsContent = ({
  issue,
}) => (

  <div className="space-y-4">

    {[
      ["Project", issue.projectName],
      ["Title", issue.title],
      ["Description", issue.description],
      ["Status", issue.status],
      ["Priority", issue.priority],
      ["Assigned To", issue.assignedToName],
      ["Role", issue.assignedToRole],
      ["Email", issue.assignedToEmail],
    ].map(([label, value]) => (

      <div
        key={label}
        className="
          rounded-xl
          border
          bg-slate-50
          p-4
        "
      >

        <p
          className="
            text-xs
            uppercase
            font-semibold
            text-slate-400
          "
        >
          {label}
        </p>

        <p
          className="
            mt-1
            text-sm
            font-medium
            text-slate-800
          "
        >
          {value || "N/A"}
        </p>

      </div>

    ))}

    {issue.imageUrl && (

      <div>

        <p className="font-medium mb-2">
          Bug Image
        </p>

        <img
          src={issue.imageUrl}
          alt="Bug"
          className="
            w-full
            max-h-72
            object-contain
            rounded-xl
            border
          "
        />

      </div>

    )}

    {issue.resolutionImageUrl && (

      <div>

        <p className="font-medium mb-2">
          Resolution Proof
        </p>

        <img
          src={issue.resolutionImageUrl}
          alt="Resolution"
          className="
            w-full
            max-h-72
            object-contain
            rounded-xl
            border
          "
        />

      </div>

    )}

  </div>
);

export default TaskOverview;