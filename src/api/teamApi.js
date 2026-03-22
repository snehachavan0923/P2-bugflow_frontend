import axios from './axios';

export const getTeamMembers = async (projectId) => {
  const response = await axios.get(`/projects/${projectId}/team`);
  return response.data;
};

export const addTeamMember = async (projectId, memberData) => {
  const response = await axios.post(`/projects/${projectId}/team`, memberData);
  return response.data;
};

export const removeTeamMember = async (projectId, memberId) => {
  const response = await axios.delete(`/projects/${projectId}/team/${memberId}`);
  return response.data;
};

export const updateTeamMemberRole = async (projectId, memberId, role) => {
  const response = await axios.put(`/projects/${projectId}/team/${memberId}`, { role });
  return response.data;
};