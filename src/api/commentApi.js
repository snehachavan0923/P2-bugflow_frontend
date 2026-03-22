import axios from './axios';

export const getComments = async (projectId, issueId) => {
  const response = await axios.get(`/projects/${projectId}/issues/${issueId}/comments`);
  return response.data;
};

export const createComment = async (projectId, issueId, commentData) => {
  const response = await axios.post(`/projects/${projectId}/issues/${issueId}/comments`, commentData);
  return response.data;
};

export const updateComment = async (projectId, issueId, commentId, commentData) => {
  const response = await axios.put(`/projects/${projectId}/issues/${issueId}/comments/${commentId}`, commentData);
  return response.data;
};

export const deleteComment = async (projectId, issueId, commentId) => {
  const response = await axios.delete(`/projects/${projectId}/issues/${issueId}/comments/${commentId}`);
  return response.data;
};