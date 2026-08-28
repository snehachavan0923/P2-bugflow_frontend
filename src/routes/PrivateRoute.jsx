import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { token, role, loading, authInProgress } = useAuth();
  const location = useLocation();

  console.debug('PrivateRoute:', {
    pathname: location.pathname,
    token: !!token,
    user: !!role,
    loading,
    authInProgress,
  });

  // If an authentication exchange is in progress, don't redirect yet — let it finish.
  if (loading || authInProgress) {
    console.debug('PrivateRoute: waiting for auth to finish before route decision', { pathname: location.pathname, loading, authInProgress });
    return null;
  }

  if (!token) {
    console.debug('PrivateRoute: unauthenticated, redirecting to /login', { pathname: location.pathname });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;
