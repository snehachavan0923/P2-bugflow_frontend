import axios from './axios';

export const getAdminSubscriptions = async ({
  search = '',
  plan = '',
  status = '',
  paymentStatus = '',
  page = 0,
  size = 10,
} = {}) => {
  const response = await axios.get('/admin/subscriptions', {
    params: {
      search,
      plan,
      status,
      paymentStatus,
      page,
      size,
    },
  });

  return response.data;
};

export const getAdminSubscriptionDetail = async (subscriptionId) => {
  const response = await axios.get(`/admin/subscriptions/${subscriptionId}`);
  return response.data;
};

export const getAdminRevenueDashboard = async ({ from, to, plan } = {}) => {
  const params = {};
  if (from) params.from = from;
  if (to) params.to = to;
  if (plan) params.plan = plan;

  const response = await axios.get('/admin/revenue/dashboard', { params });
  return response.data;
};
