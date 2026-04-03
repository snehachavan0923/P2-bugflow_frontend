import axios from './axios';

export const getIssues = async (projectId) => {
  const res = await axios.get(`/projects/${projectId}/issues`);
  return res.data;
};

export const createIssue = async (projectId, data) => {
  const res = await axios.post(`/projects/${projectId}/issues`, data);
  return res.data;
};

export const updateIssue = async (projectId, issueId, data) => {
  const res = await axios.put(`/projects/${projectId}/issues/${issueId}`, data);
  return res.data;
};