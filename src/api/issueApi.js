import axios from './axios';

export const getIssues = async (projectId) => {
  const res = await axios.get(`/projects/${projectId}/issues`);
  return res.data;
};

export const getIssue = async (projectId, issueId) => {
  const res = await axios.get(
    `/projects/${projectId}/issues/${issueId}`
  );
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

/*
export const getMyTasks = async () => {

  const res = await axios.get(
    `/projects/dummy/issues/my-tasks`
  );

  return res.data;
};
*/

export const moveIssueStatus = async (
  projectId,
  issueId,
  status
) => {
  const res = await axios.put(
    `/projects/${projectId}/issues/${issueId}/status`,
    null,
    {
      params: { status }
    }
  );

  return res.data;
};

/*
  export const getReviewIssues = async () => {
  const res = await axios.get(
    `/projects/dummy/issues/review`
  );

  return res.data;
};
*/

export const approveIssue = async (
  projectId,
  issueId
) => {
  const res = await axios.put(
    `/projects/${projectId}/issues/${issueId}/approve`
  );

  return res.data;
};

export const rejectIssue = async (
  projectId,
  issueId
) => {
  const res = await axios.put(
    `/projects/${projectId}/issues/${issueId}/reject`
  );

  return res.data;
};

export const getProjectTasks = async (
  projectId
) => {

  const res = await axios.get(
    `/projects/${projectId}/issues/project-my-tasks`
  );

  return res.data;
};

export const getProjectReviewIssues =
  async (projectId) => {

  const res = await axios.get(
    `/projects/${projectId}/issues/project-review`
  );

  return res.data;
};