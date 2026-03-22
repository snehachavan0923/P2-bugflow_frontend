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