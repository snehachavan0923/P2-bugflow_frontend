import { useEffect } from "react";
import Swal from "sweetalert2";

const Unauthorized = () => {

  useEffect(() => {

    Swal.fire({
      icon: "error",
      title: "Request Failed",
      text: "403 - Unauthorized Access",
      confirmButtonText: "OK",
      allowOutsideClick: false,
      customClass: {
        popup: "rounded-3xl"
      }
    });

  }, []);

  return null;
};

export default Unauthorized;