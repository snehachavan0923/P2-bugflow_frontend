import {
  Eye,
  FolderKanban,
  Bug,
} from "lucide-react";

const ViewerDashboard = () => {

  return (

    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Viewer Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          View projects, issues and team progress.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">

        <div className="rounded-2xl bg-white p-6 shadow">
          <FolderKanban
            size={36}
            className="text-blue-600"
          />

          <h3 className="mt-4 text-lg font-semibold">
            Projects
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Browse available projects and project details.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <Bug
            size={36}
            className="text-red-600"
          />

          <h3 className="mt-4 text-lg font-semibold">
            Issues
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            View issue status and progress.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <Eye
            size={36}
            className="text-emerald-600"
          />

          <h3 className="mt-4 text-lg font-semibold">
            Read Only Access
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            You can monitor project activity but cannot modify data.
          </p>
        </div>

      </div>

      <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-white">
        <h2 className="text-2xl font-bold">
          Welcome Viewer
        </h2>

        <p className="mt-3 text-slate-300">
          Select a project from the Projects page and open the
          Kanban board to track issue progress across Open,
          In Progress, Review and Done stages.
        </p>
      </div>

    </div>
  );
};

export default ViewerDashboard;