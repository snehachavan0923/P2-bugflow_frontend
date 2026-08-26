import React from "react";
import {
  CheckCircle2,
  Circle,
  Clock3,
  ListTodo,
  UserRound,
  Sparkles,
  BadgeCheck,
} from "lucide-react";

import { useProjectWorkspace } from "./WorkspaceContext";

const ProjectOverview = () => {
  const {
    project,
    projectId,
    members,
    issueStats,
    showMemberCount,
    showIssueStats,
  } = useProjectWorkspace();

  const owner =
    project.ownerName ||
    project.ownerEmail ||
    project.ownerId ||
    "Not available";

  const issueCards = [
    {
      label: "Open",
      value: issueStats?.open ?? 0,
      icon: Circle,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      label: "In Progress",
      value: issueStats?.inProgress ?? 0,
      icon: Clock3,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      label: "Review",
      value: issueStats?.review ?? 0,
      icon: UserRound,
      tone: "bg-rose-50 text-rose-700",
    },
    {
      label: "Done",
      value: issueStats?.done ?? 0,
      icon: CheckCircle2,
      tone: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.22)] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              <Sparkles className="h-4 w-4" />
              Executive overview
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              {project.name}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {project.description || "No project description provided."}
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <BadgeCheck className="h-5 w-5" />
            Healthy delivery status
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InfoCard label="Project Name" value={project.name} icon={ListTodo} />
          <InfoCard label="Project ID" value={projectId} icon={BadgeCheck} />
          <InfoCard label="Owner" value={owner} icon={UserRound} />
          {showMemberCount && (
            <InfoCard label="Member Count" value={members.length} icon={UserRound} />
          )}
        </div>
      </section>

      {showIssueStats && issueStats && (
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-28px_rgba(15,23,42,0.16)] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Issue Statistics
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">
                Current workload
              </h3>
            </div>
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
              <ListTodo className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {issueCards.map(({ label, value, icon: Icon, tone }) => (
              <div
                key={label}
                className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <div className={`rounded-2xl p-3 ${tone}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-3xl font-semibold text-slate-950">{value}</span>
                </div>
                <p className="mt-4 text-sm font-medium text-slate-600">{label}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const InfoCard = ({ label, value, icon: Icon }) => (
  <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
      {Icon && <Icon className="h-4 w-4 text-blue-600" />}
      <span>{label}</span>
    </div>
    <p className="mt-3 break-words text-base font-semibold text-slate-950">
      {value || "Not available"}
    </p>
  </div>
);

export default ProjectOverview;
