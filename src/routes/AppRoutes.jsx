import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/public/Home';
import Pricing from '../pages/public/Pricing';
import About from '../pages/public/About';
import Login from '../auth/Login';
import Signup from '../auth/Signup';
import OwnerDashboard from '../pages/owner/OwnerDashboard';
import ProjectList from '../pages/project/ProjectList';
import CreateProject from '../pages/project/CreateProject';
import ProjectDetails from '../pages/project/ProjectDetails';
import IssueBoard from '../pages/issues/IssueBoard';
import TeamManagement from '../pages/team/TeamManagement';
import MyTasks from '../pages/tasks/MyTasks';
import VerifyIssue from '../pages/verification/VerifyIssue';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ProjectManagement from '../pages/admin/ProjectManagement';
import SubscriptionManagement from '../pages/admin/SubscriptionManagement';
import Profile from '../pages/users/Profile';
import Settings from '../pages/users/Settings';
import NotFound from '../Errors/NotFound';
import Unauthorized from '../Errors/Unauthorized';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import OwnerLayout from '../layouts/OwnerLayout';
import PrivateRoute from './PrivateRoute';
import CreateIssue from '../pages/issues/CreateIssue';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="about" element={<About />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Owner / Team Routes */}
      <Route
        element={
          <PrivateRoute allowedRoles={['Owner', 'Developer', 'Tester', 'Viewer']}>
            <OwnerLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="projects" element={<ProjectList />} />
        <Route path="projects/create" element={<CreateProject />} />
        <Route path="projects/:projectId" element={<ProjectDetails />} />
         <Route path="projects/:projectId/issues" element={<IssueBoard />} />
         <Route path="projects/:projectId/create-issue" element={<CreateIssue  />} />

        <Route path="projects/:projectId/team" element={<TeamManagement />} />
        <Route path="my-tasks" element={<MyTasks />} />
        <Route path="verify-issues" element={<VerifyIssue />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>  

      {/* Admin Routes */}
      <Route
        element={
          <PrivateRoute allowedRoles={['Admin']}>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/projects" element={<ProjectManagement />} />
        <Route path="admin/subscriptions" element={<SubscriptionManagement />} />
      </Route>

      {/* Error Routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
