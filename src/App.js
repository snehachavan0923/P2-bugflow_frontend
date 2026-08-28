import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { OrganizationProvider } from './context/OrganizationContext';
import SubscriptionExpiredModal from './components/subscription/SubscriptionExpiredModal';
import Auth0Handler from './auth/Auth0Handler';

function App() {
  return (
    <AuthProvider>
      <OrganizationProvider>
        <ProjectProvider>
          <BrowserRouter>
            <Auth0Handler />
            <AppRoutes />
            <SubscriptionExpiredModal />
          </BrowserRouter>
        </ProjectProvider>
      </OrganizationProvider>
    </AuthProvider>
  );
}

export default App;
