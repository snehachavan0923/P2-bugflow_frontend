import axios from './axios';

export const getAdminPlans = async () => {
  const response = await axios.get('/admin/plans');
  return response.data;
};

export const updateAdminPlan = async (planId, planData) => {
  const response = await axios.put(`/admin/plans/${planId}`, planData);
  return response.data;
};
