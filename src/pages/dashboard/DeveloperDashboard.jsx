import {
  useEffect,
  useState,
} from "react";

import {
  ClipboardList,
  PlayCircle,
  Clock3,
  Loader2,
} from "lucide-react";

import {
  getDeveloperDashboard,
} from "../../api/dashboardApi";

import StatCard from "../../components/dashboard/StatCard";

const DeveloperDashboard = () => {

  const [stats, setStats] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const loadData =
      async () => {

      try {

        const data =
          await getDeveloperDashboard();

        setStats(data);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);
      }
    };

    loadData();

  }, []);

  if (loading) {

    return (
      <div className="flex justify-center py-20">
        <Loader2
          size={30}
          className="animate-spin"
        />
      </div>
    );
  }

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          Developer Dashboard
        </h1>

        <p className="text-slate-500">
          Track your assigned work
        </p>

      </div>

      <div
        className="
          grid
          md:grid-cols-3
          gap-5
        "
      >

        <StatCard
          title="Assigned Tasks"
          value={stats.assignedTasks}
          icon={<ClipboardList />}
          color="bg-blue-100 text-blue-600"
        />

        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={<PlayCircle />}
          color="bg-amber-100 text-amber-600"
        />

        <StatCard
          title="Review"
          value={stats.review}
          icon={<Clock3 />}
          color="bg-purple-100 text-purple-600"
        />

      </div>

    </div>
  );
};

export default DeveloperDashboard;