import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuth } from '../context/AuthContext';
// Read audience at module scope so runtime env is available to hooks
const AUTH0_AUDIENCE = process.env.REACT_APP_AUTH0_AUDIENCE;

const Auth0Handler = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: isAuth0Loading, getAccessTokenSilently } = useAuth0();
  const { user, token, loginWithAuth0, authInProgress } = useAuth();
  const [processing, setProcessing] = React.useState(false);


  console.log('[AUTH FLOW] Runtime Auth0 config:', {
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    clientIdPresent: !!process.env.REACT_APP_AUTH0_CLIENT_ID,
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  });

  React.useEffect(() => {
    let mounted = true;

    const handleAuth0Callback = async () => {
      if (!isAuthenticated || isAuth0Loading) return;
      if (authInProgress || processing) {
        console.debug('[AUTH FLOW] exchange already in progress, skipping duplicate callback handling');
        return;
      }

      if (!AUTH0_AUDIENCE) {
        console.error('[AUTH FLOW] Missing REACT_APP_AUTH0_AUDIENCE');
        return;
      }

      const initiated = localStorage.getItem('auth0LoginInitiated');
      const wasLoggedOut = localStorage.getItem('auth0Logout');
      console.debug('[AUTH FLOW] pathname:', window.location.pathname);
      console.debug('[AUTH FLOW] Auth0 authenticated:', { isAuthenticated, initiated, wasLoggedOut, token: !!token, user: !!user });

      if (!initiated) {
        console.debug('[AUTH FLOW] auth0LoginInitiated not present; skipping exchange');
        return;
      }
      if (wasLoggedOut) {
        console.debug('[AUTH FLOW] auth0Logout flag present; skipping exchange');
        localStorage.removeItem('auth0Logout');
        localStorage.removeItem('auth0LoginInitiated');
        return;
      }

      if (token && user) {
        localStorage.removeItem('auth0LoginInitiated');
        return;
      }
      if (processing) return;

      try {
        setProcessing(true);
        console.debug('[AUTH FLOW] exchange started: getAccessTokenSilently');
        const accessToken = await getAccessTokenSilently({
          audience: AUTH0_AUDIENCE,
        });
        console.debug('[AUTH FLOW] access token obtained');
        console.debug('[AUTH FLOW] exchange started: loginWithAuth0');
        const loggedUser = await loginWithAuth0(accessToken);
        console.debug('[AUTH FLOW] exchange succeeded:', { email: loggedUser?.email, role: loggedUser?.role });
        console.debug('[AUTH FLOW] BugFlow user:', { email: loggedUser?.email });
        console.debug('[AUTH FLOW] BugFlow role:', { role: loggedUser?.role });
        localStorage.removeItem('auth0LoginInitiated');

        const persisted = localStorage.getItem('token');
        if (!persisted) {
          console.debug('[AUTH FLOW] waiting for BugFlow token persistence');
          const start = Date.now();
          while (!localStorage.getItem('token') && Date.now() - start < 1000) {
            // eslint-disable-next-line no-await-in-loop
            await new Promise((r) => setTimeout(r, 100));
          }
        }

        const userRole = loggedUser?.role;
        console.debug('[AUTH FLOW] BugFlow session stored');
        console.debug('[AUTH FLOW] navigating to:', userRole === 'Admin' ? '/admin' : '/dashboard');
        navigate(userRole === 'Admin' ? '/admin' : '/dashboard');
      } catch (err) {
        console.error('[AUTH FLOW] Auth0 token exchange failed:', err);
      } finally {
        if (mounted) setProcessing(false);
      }
    };

    handleAuth0Callback();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isAuth0Loading, token, user]);

  if (!processing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
      <div className="rounded-lg bg-white px-6 py-4 shadow">Processing login...</div>
    </div>
  );
};

export default Auth0Handler;
