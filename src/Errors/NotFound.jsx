import { useEffect } from "react";
import Swal from "sweetalert2";

const NotFound = () => {

  useEffect(() => {

    Swal.fire({
      icon: "error",
      title: "Request Failed",
      text: "404 - Page Not Found",
      confirmButtonText: "OK",
      allowOutsideClick: false,
      customClass: {
        popup: "rounded-3xl"
      }
    });

  }, []);

  return null;
};

export default NotFound;