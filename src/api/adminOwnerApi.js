import axios from "./axios";

export const getAdminOwners = async () => {
  const response = await axios.get("/admin/owners");
  return response.data;
};

export const getAdminOwnerById = async (ownerId) => {
  const response = await axios.get(`/admin/owners/${ownerId}`);
  return response.data;
};