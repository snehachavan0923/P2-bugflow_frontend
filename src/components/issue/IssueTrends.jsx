import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const IssueTrends = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || !data.weeklyCreated || !data.weeklyResolved) return [];

    // Combine weekly created and resolved data
    const combined = data.weeklyCreated.map((item, idx) => ({
      week: item.week,
      created: item.count,
      resolved: data.weeklyResolved[idx]?.count || 0,
    }));

    // Filter out weeks with no data to reduce chart clutter
    return combined.filter((item) => item.created > 0 || item.resolved > 0);
  }, [data]);

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Trends Chart */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
          <p className="text-sm font-medium text-slate-500">Issue Trends</p>
          <h2 className="text-xl font-semibold text-slate-900">Weekly created vs resolved</h2>
        </div>

        <div className="p-6">
          {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="week"
                  stroke="#64748b"
                  style={{ fontSize: "12px" }}
                  tick={{ fill: "#64748b" }}
                />
                <YAxis
                  stroke="#64748b"
                  style={{ fontSize: "12px" }}
                  tick={{ fill: "#64748b" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  cursor={{ stroke: "#cbd5e1", strokeWidth: 2 }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "16px" }}
                  iconType="line"
                />
                <Line
                  type="monotone"
                  dataKey="created"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Created"
                  isAnimationActive={true}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Resolved"
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-80 items-center justify-center bg-slate-50">
              <p className="text-slate-500">No data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Average Resolution Time</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {data.averageResolutionDays || 0}
          </p>
          <p className="mt-2 text-xs text-slate-600">days</p>
          <div className="mt-4 h-1.5 rounded-full bg-blue-100">
            <div className="h-1.5 rounded-full bg-blue-500" style={{ width: "100%" }} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Fastest Resolution</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {data.fastestResolutionDays || 0}
          </p>
          <p className="mt-2 text-xs text-slate-600">days</p>
          <div className="mt-4 h-1.5 rounded-full bg-emerald-100">
            <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: "100%" }} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Slowest Resolution</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {data.slowestResolutionDays || 0}
          </p>
          <p className="mt-2 text-xs text-slate-600">days</p>
          <div className="mt-4 h-1.5 rounded-full bg-red-100">
            <div className="h-1.5 rounded-full bg-red-500" style={{ width: "100%" }} />
          </div>
        </div>
      </div>

      {/* Trends Table (Alternative view) */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
          <p className="text-sm font-medium text-slate-500">Weekly Breakdown</p>
          <h2 className="text-xl font-semibold text-slate-900">Detailed trends</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Week</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Created</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Resolved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {chartData.map((item) => (
                <tr key={item.week} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                    {item.week}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                      {item.created}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                      {item.resolved}
                    </span>
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

export default IssueTrends;