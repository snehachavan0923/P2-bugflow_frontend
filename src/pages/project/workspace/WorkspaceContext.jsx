import { createContext, useContext } from "react";

const ProjectWorkspaceContext = createContext(null);

export const ProjectWorkspaceProvider =
  ProjectWorkspaceContext.Provider;

export const useProjectWorkspace = () =>
  useContext(ProjectWorkspaceContext);
