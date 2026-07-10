import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { OrganizationProvider } from './context/OrganizationContext';
import SubscriptionExpiredModal from './components/subscription/SubscriptionExpiredModal';

function App() {
  return (
    <AuthProvider>
      <OrganizationProvider>
        <ProjectProvider>
          <BrowserRouter>
            <AppRoutes />
            <SubscriptionExpiredModal />
          </BrowserRouter>
        </ProjectProvider>
      </OrganizationProvider>
    </AuthProvider>
  );
}

export default App;
