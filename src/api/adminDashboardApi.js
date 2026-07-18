import axios from './axios';

/**
 * Fetch admin dashboard statistics and recent activities
 * @returns {Promise} Dashboard stats including KPIs and recent activities
 */
export const getAdminDashboardStats = async () => {
  const response = await axios.get('/admin/dashboard/stats');
  return response.data;
};
