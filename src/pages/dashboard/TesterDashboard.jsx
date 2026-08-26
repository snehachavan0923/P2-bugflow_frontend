import {
  useEffect,
  useState,
} from "react";

import {
  Bug,
  Clock3,
  CheckCircle,
  ShieldCheck,
  Sparkles,
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getTesterDashboard();
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
      <div className="flex min-h-[50vh] items-center justify-center bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <LoaderWithMessage message="Loading dashboard data..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Hero Header Section */}
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.22)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                <ShieldCheck className="h-4 w-4" />
                QA & Testing Command
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Tester Dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Verify issue fixes, perform quality assurance testing, and validate bug resolutions across active projects.
              </p>
            </div>
          </div>

          {/* Metric Overview Cards */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <StatCard
              title="Assigned Issues"
              value={stats.assignedIssues}
              icon={<Bug className="h-5 w-5" />}
              color="bg-blue-100 text-blue-700"
            />
            <StatCard
              title="Pending Verification"
              value={stats.pendingVerification}
              icon={<Clock3 className="h-5 w-5" />}
              color="bg-amber-100 text-amber-700"
            />
            <StatCard
              title="Verified"
              value={stats.verified}
              icon={<CheckCircle className="h-5 w-5" />}
              color="bg-emerald-100 text-emerald-700"
            />
          </div>
        </div>

        {/* QA Verification Workflow Card */}
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.18)] sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl border border-emerald-100/80 bg-emerald-50 p-2.5 text-emerald-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">QA Verification Workflow</h2>
              <p className="text-xs font-medium text-slate-500">Monitor pending reviews and validate resolution evidence</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-sm font-semibold text-slate-950">Pending Verification Queue</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                There are <strong className="text-amber-600">{stats.pendingVerification}</strong> issues awaiting QA verification. Inspect resolution proofs and update issue statuses when validated.
              </p>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-sm font-semibold text-slate-950">Verified Resolutions</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                <strong className="text-emerald-600">{stats.verified}</strong> issues have been successfully tested and verified as resolved across your assigned projects.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TesterDashboard;