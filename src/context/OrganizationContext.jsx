import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import { getMyOrganization } from '../api/organizationApi';

const OrganizationContext = createContext();

export const useOrganization = () => useContext(OrganizationContext);

const isOrganizationNotFound = (error) => {
  const message = error.response?.data?.message || error.message || '';

  return message.toLowerCase().includes('organization not found');
};

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
      if (isOrganizationNotFound(error)) {
        setOrganization(null);
        return null;
      }

      throw error;
    } finally {
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
