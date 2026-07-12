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
  const res = await axios.put('/subscriptions/upgrade', { plan: planName }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return res.data;
};

export const createSubscriptionPayment = async (planName) => {
  const res = await axios.post('/subscriptions/payment', { plan: planName }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return res.data;
};

export const getPaymentHistory = async () => {
  const res = await axios.get('/subscriptions/payments');
  return res.data;
};

export const getSubscriptionStatus = async () => {
  const res = await axios.get('/subscriptions/status');
  return res.data;
};

export const getAvailablePlans = async () => {
    const { data } = await axios.get("/subscriptions/plans");
    return data;
};