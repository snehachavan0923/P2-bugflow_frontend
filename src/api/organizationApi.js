import axios from './axios';

export const createOrganization = async (data) => {
  const res = await axios.post('/organizations', data);
  return res.data;
};

export const getMyOrganization = async () => {
  const res = await axios.get('/organizations/me');
  return res.data;
};

export const getOrganizationSettings =
  async () => {
    const res =
      await axios.get(
        "/organizations/settings"
      );

    return res.data;
  };

  export const getOrganizationMembers =
  async () => {

    const res =
      await axios.get(
        "/organizations/members"
      );

    return res.data;
};