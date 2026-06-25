import React from "react";
import { BarChart3 } from "lucide-react";

const ProjectReports = () => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          <BarChart3 className="h-6 w-6" />
        </span>
        <div>
          <h2 className="text-xl font-bold text-slate-950">
            Reports coming soon.
          </h2>
        </div>
      </div>
    </div>
  );
};

export default ProjectReports;
