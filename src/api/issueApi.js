import axios from './axios';

export const getIssues = async (projectId) => {
  const res = await axios.get(`/projects/${projectId}/issues`);
  return res.data;
};

export const createIssue = async (projectId, formData) => {
  const res = await axios.post(
    `/projects/${projectId}/issues`,
    formData
  );
  return res.data;
};
export const updateIssue = async (projectId, issueId, status) => {
  const res = await axios.put(
    `/projects/${projectId}/issues/${issueId}/status`,
    null,
    { params: { status } }
  );
  return res.data;
};

export const editIssue = async (projectId, issueId, data) => {
  const res = await axios.put(
    `/projects/${projectId}/issues/${issueId}`,
    data
  );
  return res.data;
};

export const resolveIssue = async (projectId, issueId, formData) => {
  const res = await axios.put(
    `/projects/${projectId}/issues/${issueId}/resolve`,
    formData
  );
  return res.data;
};