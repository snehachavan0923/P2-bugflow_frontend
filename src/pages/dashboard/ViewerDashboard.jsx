import {
  FolderKanban,
  Users,
  Bug,
  ClipboardList,
  Loader2,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  getViewerDashboard,
} from "../../api/dashboardApi";

import StatCard from "../../components/dashboard/StatCard";
const ViewerDashboard = () => {

 const [stats, setStats] = useState({
  totalProjects: 0,
  totalMembers: 0,
  totalIssues: 0,
  assignedTasks: 0,
});
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const load = async () => {

      try {

        const data = await getViewerDashboard();

        setStats(data);

      } catch {
        // Axios interceptor already handled it.

      } finally {

        setLoading(false);

      }

    };

    load();

  }, []);

  if (loading) {

    return (
      <div className="flex justify-center py-20">
        <Loader2
          className="animate-spin"
          size={30}
        />
      </div>
    );

  }

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          Viewer Dashboard
        </h1>

        <p className="text-slate-500">
          Monitor organization projects and issues.
        </p>

      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={<FolderKanban />}
          color="bg-blue-100 text-blue-600"
        />

        <StatCard
          title="Total Members"
          value={stats.totalMembers}
          icon={<Users />}
          color="bg-violet-100 text-violet-600"
        />

        <StatCard
          title="Total Issues"
          value={stats.totalIssues}
          icon={<Bug />}
          color="bg-red-100 text-red-600"
        />

        <StatCard
          title="Assigned Tasks"
          value={stats.assignedTasks}
          icon={<ClipboardList />}
          color="bg-emerald-100 text-emerald-600"
        />

      </div>

      <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-white">

        <h2 className="text-2xl font-bold">

          Read Only Workspace

        </h2>

        <p className="mt-3 text-slate-300">

          You have read-only access to your organization's projects,
          issues and workflow. Monitor progress across Open,
          In Progress, Review and Done without modifying data.

        </p>

      </div>

    </div>

  );

};

export default ViewerDashboard; 