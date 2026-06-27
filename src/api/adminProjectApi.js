import axios from "./axios";

export const getAdminProjects = async () => {
  const response = await axios.get("/admin/projects");
  return response.data;
};

export const getAdminProjectById = async (projectId) => {
  const response = await axios.get(`/admin/projects/${projectId}`);
  return response.data;
};