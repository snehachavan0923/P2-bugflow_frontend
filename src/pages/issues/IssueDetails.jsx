import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getIssue } from "../../api/issueApi";

const IssueDetails = () => {
  const { projectId, issueId } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setError("");
        setLoading(true);
        const data = await getIssue(projectId, issueId);
        setIssue(data);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            "Unable to load issue details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [projectId, issueId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" aria-hidden="true" />
          <span className="text-sm font-medium text-slate-700">
            Loading issue details...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-200 bg-white p-6 text-red-700 shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!issue) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Link
            to={`/projects/${projectId}/issues`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to board
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            {issue.title}
          </h1>
          <p className="text-sm text-slate-500">
            Issue ID: {issue.id || issue._id}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Description
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-700 whitespace-pre-wrap">
              {issue.description || "No description provided."}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Status
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {issue.status}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Priority
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {issue.priority || "Medium"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-950">Assignee</h3>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {issue.assignedToName || "Unassigned"}
            </p>
            <p className="text-sm text-slate-500">
              {issue.assignedToRole || "No role"}
            </p>
            <p className="text-sm text-slate-500 break-words">
              {issue.assignedToEmail || "No email"}
            </p>
          </div>
        </section>

        <section className="space-y-6">
          {issue.imageUrl && (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <img
                src={issue.imageUrl}
                alt="Issue screenshot"
                className="w-full object-contain"
              />
            </div>
          )}

          {issue.resolutionImageUrl && (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <img
                src={issue.resolutionImageUrl}
                alt="Resolution proof"
                className="w-full object-contain"
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default IssueDetails;
