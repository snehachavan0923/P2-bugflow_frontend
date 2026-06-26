import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import { getMyOrganization } from '../api/organizationApi';

const OrganizationContext = createContext();

export const useOrganization = () => useContext(OrganizationContext);



export const OrganizationProvider = ({ children }) => {
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(false);
  const loadOrganization = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getMyOrganization();
      setOrganization(data);
      return data;
    } catch (error) {

    if (error.response?.status === 404) {

        // Owner has not created an organization yet
        setOrganization(null);
        return null;
    }

    // Any other error should NOT be treated
    // as "organization not found"

    throw error;
}finally {
      setLoading(false);
    }
  }, []);

  const refreshOrganization = useCallback(() => {
    return loadOrganization();
  }, [loadOrganization]);

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        loading,
        loadOrganization,
        refreshOrganization,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};
