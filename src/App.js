import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { OrganizationProvider } from './context/OrganizationContext';

function App() {
  return (
    <AuthProvider>
      <OrganizationProvider>
        <ProjectProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ProjectProvider>
      </OrganizationProvider>
    </AuthProvider>
  );
}

export default App;
