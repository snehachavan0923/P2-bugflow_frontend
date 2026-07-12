import axios from "./axios";

export const getAdminPayments = async (params) => {
  const { data } = await axios.get("/admin/payments", {
    params,
  });
  return data;
};

export const getRevenueDashboard = async () => {
  const { data } = await axios.get(
    "/admin/revenue/dashboard"
  );
  return data;
};