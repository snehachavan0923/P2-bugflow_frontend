import React from "react";
import { useAuth } from "../../context/AuthContext";

import OwnerDashboard from "../owner/OwnerDashboard";
import DeveloperDashboard from "./DeveloperDashboard";
import TesterDashboard from "./TesterDashboard";
import ViewerDashboard from "./ViewerDashboard";

const DashboardRouter = () => {
  const { role } = useAuth();

  switch (role) {
    case "Owner":
      return <OwnerDashboard />;

    case "Developer":
      return <DeveloperDashboard />;

    case "Tester":
      return <TesterDashboard />;

    case "Viewer":
      return <ViewerDashboard />;

    default:
      return <OwnerDashboard />;
  }
};

export default DashboardRouter;