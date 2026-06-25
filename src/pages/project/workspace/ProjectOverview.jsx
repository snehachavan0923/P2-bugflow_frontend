import React from "react";
import {
  CheckCircle2,
  Circle,
  Clock3,
  ListTodo,
  UserRound,
} from "lucide-react";

import { useProjectWorkspace } from "../ProjectWorkspace";

const ProjectOverview = () => {
  const {
    project,
    projectId,
    members,
    issueStats,
  } = useProjectWorkspace();

  const owner =
    project.ownerName ||
    project.ownerEmail ||
    project.ownerId ||
    "Not available";

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            Project Overview
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">
            {project.name}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            {project.description ||
              "No project description provided."}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard
            label="Project Name"
            value={project.name}
          />
          <InfoCard
            label="Project ID"
            value={projectId}
          />
          <InfoCard label="Owner" value={owner} />
          <InfoCard
            label="Member Count"
            value={members.length}
          />
        </div>
      </section>

      <aside className="space-y-6">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Issue Statistics
              </p>
              <h3 className="mt-1 text-xl font-bold text-slate-950">
                Current workload
              </h3>
            </div>
            <ListTodo className="h-5 w-5 text-blue-600" />
          </div>

          <div className="space-y-3">
            <StatRow
              icon={Circle}
              label="Open"
              value={issueStats.open}
            />
            <StatRow
              icon={Clock3}
              label="In Progress"
              value={issueStats.inProgress}
            />
            <StatRow
              icon={UserRound}
              label="Review"
              value={issueStats.review}
            />
            <StatRow
              icon={CheckCircle2}
              label="Done"
              value={issueStats.done}
            />
          </div>
        </section>
      </aside>
    </div>
  );
};

const InfoCard = ({ label, value }) => (
  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </p>
    <p className="mt-2 break-words text-sm font-semibold text-slate-950">
      {value || "Not available"}
    </p>
  </div>
);

const StatRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm">
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-sm font-semibold text-slate-700">
        {label}
      </span>
    </div>
    <span className="text-lg font-bold text-slate-950">
      {value}
    </span>
  </div>
);

export default ProjectOverview;
