import {
  useEffect,
  useState,
} from "react";

import {
  Bug,
  Clock3,
  CheckCircle,
} from "lucide-react";

import {
  getTesterDashboard,
} from "../../api/dashboardApi";

import StatCard from "../../components/dashboard/StatCard";
import LoaderWithMessage from "../../components/common/LoaderWithMessage";

const TesterDashboard = () => {

  const [stats, setStats] = useState({
  assignedIssues: 0,
  pendingVerification: 0,
  verified: 0,
});

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const loadData =
      async () => {

      try {

        const data =
          await getTesterDashboard();

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
      <LoaderWithMessage message="Loading dashboard data..." />
    );
  }

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          Tester Dashboard
        </h1>

        <p className="text-slate-500">
          Verify and validate fixes
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
            title="Assigned Issues"
            value={stats.assignedIssues}
            icon={<Bug />}
            color="bg-blue-100 text-blue-600"
        />

        <StatCard
            title="Pending Verification"
            value={stats.pendingVerification}
            icon={<Clock3 />}
            color="bg-amber-100 text-amber-600"
        />

        <StatCard
            title="Verified"
            value={stats.verified}
            icon={<CheckCircle />}
            color="bg-green-100 text-green-600"
        />

      </div>

    </div>
  );
};

export default TesterDashboard;