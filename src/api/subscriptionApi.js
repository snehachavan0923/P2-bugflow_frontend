import axios from './axios';

export const getSubscriptionOverview = async () => {
  const [subscriptionRes, usageRes] = await Promise.all([
    axios.get('/subscriptions/me'),
    axios.get('/subscriptions/usage'),
  ]);

  return {
    ...subscriptionRes.data,
    ...usageRes.data,
  };
};

export const upgradeSubscription = async (planName) => {
  const res = await axios.put('/subscriptions/upgrade', JSON.stringify(planName), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return res.data;
};

export const getSubscriptionStatus = async () => {
  const res = await axios.get('/subscriptions/status');
  return res.data;
};
