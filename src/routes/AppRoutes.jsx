import React from "react";
import {
  Navigate,
  Routes,
  Route,
  useParams,
} from "react-router-dom";

import Home from "../pages/public/Home";
import Pricing from "../pages/public/Pricing";
import About from "../pages/public/About";

import Login from "../auth/Login";
import Signup from "../auth/Signup";

import ProjectList from "../pages/project/ProjectList";
import CreateProject from "../pages/project/CreateProject";
import ProjectWorkspace from "../pages/project/ProjectWorkspace";
import CreateOrganization from "../pages/organization/CreateOrganization";
import { useAuth } from "../context/AuthContext";

import IssueDetails from "../pages/issues/IssueDetails";

import MyTasks from "../pages/developer/MyTasks";
import VerifyIssue from "../pages/tester/VerifyIssue";

import AdminDashboard from "../pages/admin/AdminDashboard";
import ProjectManagement from "../pages/admin/ProjectManagement";
import SubscriptionManagement from "../pages/admin/SubscriptionManagement";

import Profile from "../pages/users/Profile";
import Settings from "../pages/users/Settings";

import NotFound from "../Errors/NotFound";
import Unauthorized from "../Errors/Unauthorized";

import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import OwnerLayout from "../layouts/OwnerLayout";

import PrivateRoute from "./PrivateRoute";

import DashboardRouter from "../pages/dashboard/DashboardRouter";
import OrganizationGuard from "../components/guards/OrganizationGuard";
import OrganizationSettings from "../pages/organization/OrganizationSettings";
import MembersDirectory from "../pages/organization/MembersDirectory";
import TaskOverview from "../pages/tasks/TaskOverview";
import ViewerBoard from "../pages/viewer/ViewerBoard";

const ProjectSectionRedirect = ({ section }) => {
  const { projectId } = useParams();

  return (
    <Navigate
      to={`/projects/${projectId}/${section}`}
      replace
    />
  );
};

const ProjectsRoute = () => {
  const { role } = useAuth();

  if (role === "Owner") {
    return <ProjectList />;
  }

  return <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="about" element={<About />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

        <Route
          path="create-organization"
          element={
            <PrivateRoute
              allowedRoles={["Owner"]}
            >
              <CreateOrganization />
            </PrivateRoute>
          }
        />

      {/* MAIN APP LAYOUT */}
      <Route
          element={
            <PrivateRoute
              allowedRoles={[
                "Owner",
                "Developer",
                "Tester",
                "Viewer",
              ]}
            >
              <OrganizationGuard>

                <OwnerLayout />

              </OrganizationGuard>
            </PrivateRoute>
          }
        >
          
        {/* SHARED */}
        <Route
          path="dashboard"
          element={<DashboardRouter />}
        />

        <Route
          path="projects"
          element={<ProjectsRoute />}
        />

        <Route
          path="projects/:projectId/*"
          element={<ProjectWorkspace />}
        />

        <Route
          path="profile"
          element={<Profile />}
        />

        {/* OWNER ONLY */}

        <Route
          path="projects/create"
          element={
            <PrivateRoute
              allowedRoles={["Owner"]}
            >
              <CreateProject />
            </PrivateRoute>
          }
        />

        <Route
          path="projects/:projectId/issues"
          element={<ProjectSectionRedirect section="kanban" />}
        />

        <Route
          path="projects/:projectId/issues/:issueId"
          element={
            <PrivateRoute
              allowedRoles={["Owner"]}
            >
              <IssueDetails />
            </PrivateRoute>
          }
        />

        <Route
          path="projects/:projectId/create-issue"
          element={<ProjectSectionRedirect section="kanban" />}
        />
        <Route
          path="task-overview"
          element={
            <PrivateRoute allowedRoles={["Owner"]}>
              <TaskOverview />
            </PrivateRoute>
          }
        />

        <Route
          path="settings"
          element={
            <PrivateRoute
              allowedRoles={["Owner"]}
            >
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="organization/settings"
          element={
            <PrivateRoute
              allowedRoles={["Owner"]}
            >
              <OrganizationSettings />
            </PrivateRoute>
          }
        />
        <Route
          path="organization/members"
          element={
            <PrivateRoute
              allowedRoles={["Owner"]}
            >
              <MembersDirectory />
            </PrivateRoute>
          }
        />
        {/* DEVELOPER ONLY */}

      <Route
        path="projects/:projectId/my-tasks"
        element={
          <PrivateRoute allowedRoles={["Developer"]}>
            <MyTasks />
          </PrivateRoute>
        }
      />

        {/* TESTER ONLY */}

        <Route
          path="projects/:projectId/verify-issues"
          element={
            <PrivateRoute
              allowedRoles={["Tester"]}
            >
              <VerifyIssue />
            </PrivateRoute>
          }
        />

         <Route
        path="projects/:projectId/view-board"
        element={
          <PrivateRoute
            allowedRoles={["Viewer"]}
          >
            <ViewerBoard />
          </PrivateRoute>
        }
      />
      </Route>

     

      {/* ADMIN ROUTES */}

      <Route
        element={
          <PrivateRoute
            allowedRoles={["Admin"]}
          >
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route
          path="admin"
          element={<AdminDashboard />}
        />

        <Route
          path="admin/projects"
          element={<ProjectManagement />}
        />

        <Route
          path="admin/subscriptions"
          element={<SubscriptionManagement />}
        />
      </Route>

      {/* ERROR PAGES */}

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
};

export default AppRoutes;
