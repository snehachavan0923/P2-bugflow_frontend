import axios from "./axios";

export const getOwnerDashboard = async () => {
  const res = await axios.get("/dashboard/owner");
  return res.data;
};

export const getDeveloperDashboard = async () => {
  const res = await axios.get("/dashboard/developer");
  return res.data;
};

export const getTesterDashboard = async () => {
  const res = await axios.get("/dashboard/tester");
  return res.data;
};
