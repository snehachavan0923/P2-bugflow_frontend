import axios from "axios";
import Swal from "sweetalert2";

const instance = axios.create({
  baseURL: "http://localhost:8081",
  timeout: 10000,
});

let isRedirecting = false;
let isSubscriptionExpiredShown = false;

const getStoredRole = () => {
  try {
    return JSON.parse(localStorage.getItem("user"))?.role;
  } catch {
    return null;
  }
};

instance.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

instance.interceptors.response.use(

  (response) => response,

  (error) => {
    if (!error.response) {

    if (isRedirecting) {
        return Promise.reject(error);
    }

    isRedirecting = true;

    Swal.fire({
        icon: "error",
        title: "Connection Failed",
        text:
          "Unable to connect to BugFlow. Please check your internet connection or ensure the server is running.",
        confirmButtonText: "Retry",
        allowOutsideClick: false,
        customClass: {
            popup: "rounded-3xl"
        }
    }).then(() => {
        isRedirecting = false;
    });

    return Promise.reject(error);
}

    const status =
      error.response?.status;

    if (status === 401) {

    if (isRedirecting) {
        return Promise.reject(error);
    }

    isRedirecting = true;


  Swal.fire({
    icon: "error",
    title: "Request Failed",
    text: "Session expired. Please login again.",
    confirmButtonText: "OK",
    allowOutsideClick: false,
    customClass: {
      popup: "rounded-3xl"
    }
  }).then(() => {

      isRedirecting = false;

    localStorage.clear();
    window.location.replace("/login");

  });

  return Promise.reject(error);
}

   else if (status === 403) {

    const message =
        error.response?.data?.message ||
        "You are not authorized to perform this action.";

    const normalizedMessage = message.toLowerCase();
    const isSubscriptionExpired =
      normalizedMessage.includes("subscription") &&
      normalizedMessage.includes("expired");
    const isSubscriptionLimit =
      normalizedMessage.includes("limit reached") ||
      normalizedMessage.includes("limit exceeded");

    if (isSubscriptionExpired || isSubscriptionLimit) {
      error.isSubscriptionAccessError = true;
      const role = getStoredRole();

      if (role !== "Owner") {
        if (!isRedirecting) {
          isRedirecting = true;
          Swal.fire({
            icon: "error",
            title: "Subscription Expired",
            text: "Organization subscription expired. Please contact your organization owner.",
            confirmButtonText: "OK",
            customClass: {
              popup: "rounded-3xl"
            }
          }).then(() => {
            isRedirecting = false;
          });
        }

        return Promise.reject(error);
      }

      if (!isSubscriptionExpiredShown) {
        isSubscriptionExpiredShown = true;
        try {
          window.dispatchEvent(new CustomEvent('subscriptionExpired', {
            detail: {
              message,
              reason: isSubscriptionExpired ? "expired" : "limit"
            }
          }));
        } catch (e) {
          // ignore
        }
        setTimeout(() => { isSubscriptionExpiredShown = false; }, 3000);
      }

      return Promise.reject(error);
    }

    // Prevent multiple popups for other 403s
    if (isRedirecting) {
      return Promise.reject(error);
    }

    if (
      message.toLowerCase().includes("organization")
      && message.toLowerCase().includes("suspended")
    ) {

      isRedirecting = true;

      Swal.fire({
        icon: "error",
        title: "Organization Suspended",
        text: message,
        confirmButtonText: "OK",
        allowOutsideClick: false,
        customClass: {
          popup: "rounded-3xl"
        }
      }).then(() => {

        isRedirecting = false;

      localStorage.clear();

      window.location.replace("/login");

        });

      } else {

      isRedirecting = true;

      Swal.fire({
        icon: "error",
        title: "Request Failed",
        text: message,
        confirmButtonText: "OK",
        allowOutsideClick: false,
        customClass: {
          popup: "rounded-3xl"
        }
      }).then(() => {
        isRedirecting = false;
      });

    }

      return Promise.reject(error);
    }

        else if (status === 500) {

        if (isRedirecting) {
            return Promise.reject(error);
        }

        isRedirecting = true;

        Swal.fire({
            icon: "error",
            title: "Request Failed",
            text:
                "BugFlow is temporarily unavailable. Please try again later.",
            confirmButtonText: "OK",
            allowOutsideClick: false,
            customClass: {
                popup: "rounded-3xl"
            }
        }).then(() => {
            isRedirecting = false;
        });

        return Promise.reject(error);
    }


    return Promise.reject(error);
  }
);

export default instance;
