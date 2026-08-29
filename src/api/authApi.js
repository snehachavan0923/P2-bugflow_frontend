import axios from './axios';

export const loginUser = async (credentials) => {
  const response = await axios.post('/auth/login', credentials);
  return response.data;
};

export const signupUser = async (data) => {
  const response = await axios.post('/auth/signup', data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await axios.post('/auth/logout');
  return response.data;
};

export const changeCurrentUserPassword = async (data) => {
  const response = await axios.put('/users/profile/password', data);
  return response.data;
};

export const exchangeAuth0Token = async (accessToken) => {
  const response = await axios.post('/auth/auth0', { accessToken });
  return response.data;
};

export const requestPasswordReset = async (data) => {
  const response = await axios.post('/auth/forgot-password', data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await axios.post('/auth/reset-password', data);
  return response.data;
};