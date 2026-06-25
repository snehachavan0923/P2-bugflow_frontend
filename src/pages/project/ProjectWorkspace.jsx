import React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import DeveloperWorkspace from "./DeveloperWorkspace";
import OwnerWorkspace from "./OwnerWorkspace";
import TesterWorkspace from "./TesterWorkspace";
import ViewerWorkspace from "./ViewerWorkspace";

const ProjectWorkspace = () => {
  const { role } = useAuth();

  if (role === "Owner") {
    return <OwnerWorkspace/>;
  }

  if (role === "Developer") {
    return <DeveloperWorkspace/>;
  }

  if (role === "Tester") {
    return <TesterWorkspace />;
  }

  if (role === "Viewer") {
    return <ViewerWorkspace />;
  }

  return <Navigate to="/unauthorized" replace />;
};

export default ProjectWorkspace;