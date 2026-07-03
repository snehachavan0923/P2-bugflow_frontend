import axios from './axios';

export const getProjectReportSummary = async (projectId) => {
  const res = await axios.get(`/projects/${projectId}/reports/summary`);
  return res.data;
};

export const getTeamPerformanceReport = async (projectId) => {
  const res = await axios.get(`/projects/${projectId}/reports/team`);
  return res.data;
};

export const getProjectTrendsReport = async (projectId) => {
  const res = await axios.get(`/projects/${projectId}/reports/trends`);
  return res.data;
};

// New endpoint to fetch project insights
export const getProjectInsights = async (projectId) => {
  const res = await axios.get(`/projects/${projectId}/reports/insights`);
  return res.data;
};

