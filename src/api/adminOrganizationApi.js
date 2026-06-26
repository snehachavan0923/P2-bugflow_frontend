import axios from './axios';

export const getAdminOrganizations = async () => {
  const response = await axios.get('/admin/organizations');
  return response.data;
};

export const getAdminOrganizationById = async (organizationId) => {
  const response = await axios.get(`/admin/organizations/${organizationId}`);
  return response.data;
};

export const suspendAdminOrganization = async (organizationId) => {
  const response = await axios.put(
    `/admin/organizations/${organizationId}/suspend`
  );
  return response.data;
};

export const activateAdminOrganization = async (organizationId) => {
  const response = await axios.put(
    `/admin/organizations/${organizationId}/activate`
  );
  return response.data;
};

