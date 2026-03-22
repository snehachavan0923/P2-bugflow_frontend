import axios from './axios';

export const getIssues = async (projectId) => {
  const response = await axios.get(`/projects/${projectId}/issues`);
  return response.data;
};

export const getIssue = async (projectId, issueId) => {
  const response = await axios.get(`/projects/${projectId}/issues/${issueId}`);
  return response.data;
};

export const createIssue = async (projectId, issueData) => {
  const response = await axios.post(`/projects/${projectId}/issues`, issueData);
  return response.data;
};

export const updateIssue = async (projectId, issueId, issueData) => {
  const response = await axios.put(`/projects/${projectId}/issues/${issueId}`, issueData);
  return response.data;
};

export const deleteIssue = async (projectId, issueId) => {
  const response = await axios.delete(`/projects/${projectId}/issues/${issueId}`);
  return response.data;
};