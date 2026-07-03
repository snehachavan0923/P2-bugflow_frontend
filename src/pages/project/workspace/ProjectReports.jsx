import React, { useEffect, useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";
import { useParams } from "react-router-dom";

import { getProjectReportSummary, getTeamPerformanceReport, getProjectTrendsReport, getProjectInsights } from "../../../api/reportApi";
import { alertError } from "../../../utils/alerts";
import IssueTrends from "../../../components/issue/IssueTrends";

const ProjectReports = () => {
  const { projectId } = useParams();
  const [summary, setSummary] = useState(null);
  const [teamPerformance, setTeamPerformance] = useState([]);
  const [trends, setTrends] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setError("");
        setLoading(true);
          const [summaryData, teamData, trendsData, insightsData] = await Promise.all([
            getProjectReportSummary(projectId),
            getTeamPerformanceReport(projectId),
            getProjectTrendsReport(projectId),
            getProjectInsights(projectId),
          ]);
          setSummary(summaryData);
          setTeamPerformance(teamData);
          setTrends(trendsData);
          setInsights(insightsData);
      } catch (error) {
        console.error(error);
        const message =
          error?.response?.data?.message || "Please try again later.";
        setError(message);
        alertError("Unable to load reports", message);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchSummary();
    }
  }, [projectId]);

  const statusItems = useMemo(() => {
    if (!summary) return [];
    return [
      { label: "Open", value: summary.openIssues, color: "bg-blue-500" },
      { label: "In Progress", value: summary.inProgress, color: "bg-amber-500" },
      { label: "Testing", value: summary.testing, color: "bg-purple-500" },
      { label: "Done", value: summary.completed, color: "bg-emerald-500" },
    ];
  }, [summary]);

  const priorityItems = useMemo(() => {
    if (!summary) return [];
    return [
      { label: "High", value: summary.highPriority, color: "bg-red-500" },
      { label: "Medium", value: summary.mediumPriority, color: "bg-amber-500" },
      { label: "Low", value: summary.lowPriority, color: "bg-slate-500" },
    ];
  }, [summary]);

  const totalPriority = summary
    ? summary.highPriority + summary.mediumPriority + summary.lowPriority
    : 0;

  const topPerformer = useMemo(() => {
    if (!teamPerformance.length) return null;
    return [...teamPerformance].sort((a, b) => b.completionRate - a.completionRate)[0];
  }, [teamPerformance]);

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-2/5 rounded-lg bg-slate-200" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="h-28 rounded-2xl bg-slate-100" />
            ))}
          </div>
          <div className="space-y-3">
            <div className="h-6 w-1/3 rounded-lg bg-slate-200" />
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="h-16 rounded-2xl bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-slate-900">
          <h2 className="text-xl font-semibold">Unable to load report</h2>
          <p className="mt-2 text-sm text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Project Health Report</h1>
            <p className="text-sm text-slate-500">
              A quick view of issue volume, workflow progress, and priority balance.
            </p>
          </div>
        </div>
      </div>

      {/* Issue Trends Section */}
      {trends && <IssueTrends data={trends} />}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Issues</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{summary.totalIssues}</p>
          <div className="mt-4 h-1.5 rounded-full bg-slate-100">
            <div className="h-1.5 rounded-full bg-slate-700" style={{ width: "100%" }} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Open</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{summary.openIssues}</p>
          <div className="mt-4 h-1.5 rounded-full bg-blue-100">
            <div
              className="h-1.5 rounded-full bg-blue-500"
              style={{ width: `${summary.totalIssues ? (summary.openIssues / summary.totalIssues) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Completed</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{summary.completed}</p>
          <div className="mt-4 h-1.5 rounded-full bg-emerald-100">
            <div
              className="h-1.5 rounded-full bg-emerald-500"
              style={{ width: `${summary.totalIssues ? (summary.completed / summary.totalIssues) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Completion %</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{summary.completionRate}%</p>
          <div className="mt-4 h-1.5 rounded-full bg-emerald-100">
            <div
              className="h-1.5 rounded-full bg-emerald-500"
              style={{ width: `${summary.completionRate}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Project Health</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Workflow status</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
              {summary.totalIssues} issues
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {statusItems.map((item) => {
              const width = summary.totalIssues
                ? Math.round((item.value / summary.totalIssues) * 100)
                : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm font-medium text-slate-700">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-slate-100">
                    <div
                      className={`${item.color} h-3 rounded-full`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Insights Section */}
        {insights && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Project Insights</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Oldest Open Issue */}
              <div className="p-4 border rounded-lg bg-slate-50">
                <p className="text-sm font-medium text-slate-500">Oldest Open Issue</p>
                <p className="mt-2 text-base font-medium text-slate-900 break-all">{insights.oldestOpenIssue || "-"}</p>
              </div>
              {/* High Priority Open Issues */}
              <div className="p-4 border rounded-lg bg-slate-50">
                <p className="text-sm font-medium text-slate-500">High Priority Open Issues</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{insights.highestPriorityOpen ?? 0}</p>
              </div>
              {/* Overdue Issues */}
              <div className="p-4 border rounded-lg bg-slate-50">
                <p className="text-sm font-medium text-slate-500">Overdue Issues</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{insights.overdueIssues ?? 0}</p>
              </div>
              {/* Resolved This Month */}
              <div className="p-4 border rounded-lg bg-slate-50">
                <p className="text-sm font-medium text-slate-500">Resolved This Month</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{insights.totalResolvedThisMonth ?? 0}</p>
              </div>
              {/* Most Active Developer */}
              <div className="p-4 border rounded-lg bg-slate-50">
                <p className="text-sm font-medium text-slate-500">Most Active Developer</p>
                <p className="mt-2 text-base font-medium text-slate-900">{insights.mostActiveDeveloper || "-"}</p>
              </div>
              {/* Least Active Developer */}
              <div className="p-4 border rounded-lg bg-slate-50">
                <p className="text-sm font-medium text-slate-500">Least Active Developer</p>
                <p className="mt-2 text-base font-medium text-slate-900">{insights.leastActiveDeveloper || "-"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Top Contributor Card */}
        {topPerformer && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center space-x-3">
            <span className="text-2xl" role="img" aria-label="trophy">🏆</span>
            <div>
              <p className="text-sm font-medium text-slate-500">Top Contributor</p>
              <p className="text-base font-semibold text-slate-900">
                {topPerformer.name} ({topPerformer.completionRate}%)
              </p>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-medium text-slate-500">Priority Distribution</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Risk profile</h2>
          </div>

          <div className="mt-6 space-y-4">
            {priorityItems.map((item) => {
              const percent = totalPriority
                ? Math.round((item.value / totalPriority) * 100)
                : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm font-medium text-slate-700">
                    <span>{item.label}</span>
                    <span>{item.value} ({percent}%)</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-slate-100">
                    <div
                      className={`${item.color} h-3 rounded-full`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Team Performance</p>
              <h2 className="text-xl font-semibold text-slate-900">Contributor progress</h2>
            </div>
            {topPerformer && (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                Top performer: {topPerformer.name} ({topPerformer.completionRate}%)
              </span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Assigned</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Completed</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Pending</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Completion %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {teamPerformance.map((member) => (
                <tr key={member.name} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                    {member.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">{member.assigned}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">{member.completed}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">{member.pending}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="h-2.5 w-28 rounded-full bg-slate-100">
                        <div
                          className={`h-2.5 rounded-full ${member.completionRate >= 80 ? "bg-emerald-500" : member.completionRate >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                          style={{ width: `${member.completionRate}%` }}
                        />
                      </div>
                      <span className="font-semibold text-slate-900">{member.completionRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectReports;
