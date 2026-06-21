import React, {
  useEffect,
  useState
} from "react";

import {
  Navigate,
  useLocation
} from "react-router-dom";

import { useAuth }
from "../../context/AuthContext";

import { useOrganization }
from "../../context/OrganizationContext";

const OrganizationGuard = ({
  children
}) => {

  const { role } =
    useAuth();

  const {
    organization,
    loadOrganization
  } = useOrganization();

  const [loading,
    setLoading] =
      useState(true);
      
const location =
  useLocation();

  useEffect(() => {

    const checkOrganization =
      async () => {

        try {

          if(role !== "Owner") {

            setLoading(false);

            return;
          }

          await loadOrganization();

        } catch(err) {

          console.error(
            "Organization check failed",
            err
          );

        } finally {

          setLoading(false);
        }
      };

    checkOrganization();

  }, [role, loadOrganization]);

  if(loading) {

    return (

      <div className="flex h-screen items-center justify-center">

        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

      </div>

    );
  }

  /*
   * Only owners require organization
   */
  if(
  role === "Owner" &&
  !organization &&
  location.pathname !==
    "/create-organization"
) {

    return (
      <Navigate
        to="/create-organization"
        replace
      />
    );
  }

  return children;
};

export default OrganizationGuard;