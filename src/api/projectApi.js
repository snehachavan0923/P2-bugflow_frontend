import axios from './axios';

export const getProjects = async () => {
  const res = await axios.get('/projects');
  return res.data;
};

export const createProject = async (data) => {
  const res = await axios.post('/projects', data);
  return res.data;
};