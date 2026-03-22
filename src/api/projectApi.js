import axios from './axios';

export const getProjects = async () => {
  const response = await axios.get('/projects');
  return response.data;
};

export const getProjectById = async (id) => {
  const response = await axios.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (projectData) => {
  const response = await axios.post('/projects', projectData);
  return response.data;
};

export const updateProject = async (id, projectData) => {
  const response = await axios.put(`/projects/${id}`, projectData);
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await axios.delete(`/projects/${id}`);
  return response.data;
};