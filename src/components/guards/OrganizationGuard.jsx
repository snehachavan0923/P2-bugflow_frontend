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

  const location = useLocation();
  const { role, token, user } =
    useAuth();

  console.debug('[AUTH FLOW] OrganizationGuard rendered:', { role, token: !!token, user: !!user, pathname: location.pathname });

  const {
    organization,
    loadOrganization
  } = useOrganization();
const [organizationError, setOrganizationError] = useState(false);
  const [loading,
    setLoading] =
      useState(true);

  useEffect(() => {

    const checkOrganization =
      async () => {

        try {

          if(role !== "Owner") {

            setLoading(false);

            return;
          }

         setOrganizationError(false);
        await loadOrganization();

        }catch (err) {

    console.error("Organization check failed", err);

    setOrganizationError(true);
}finally {

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
 if (
    role === "Owner" &&
    !organizationError &&
    !organization &&
    location.pathname !== "/create-organization"
) {
    console.debug('[AUTH FLOW] OrganizationGuard redirect:', { to: '/create-organization', role, hasOrganization: !!organization, organizationError });
    return (
        <Navigate
            to="/create-organization"
            replace
        />
    );
}

console.debug('[AUTH FLOW] final pathname:', location.pathname);

  return children;
};

export default OrganizationGuard;