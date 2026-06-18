import axios from "axios";
import Swal from "sweetalert2";

const instance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
});

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

    const status =
      error.response?.status;

    if (status === 401) {

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

        localStorage.clear();

        window.location.href =
          "/login";
      });
    }

    else if (status === 403) {

      Swal.fire({
        icon: "error",
        title: "Request Failed",
        text: "You are not authorized to perform this action.",
        confirmButtonText: "OK",
        allowOutsideClick: false,
        customClass: {
          popup: "rounded-3xl"
        }
      });
    }

    else if (status === 500) {

      Swal.fire({
        icon: "error",
        title: "Request Failed",
        text: "Something went wrong on the server.",
        confirmButtonText: "OK",
        allowOutsideClick: false,
        customClass: {
          popup: "rounded-3xl"
        }
      });
    }

    return Promise.reject(error);
  }
);

export default instance;