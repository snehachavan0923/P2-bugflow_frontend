import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getSubscriptionStatus } from '../../api/subscriptionApi';

export default function SubscriptionExpiredBanner() {
  const { token, role } = useAuth();
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!token || role === 'Owner') return;

      try {
        const res = await getSubscriptionStatus();
        if (mounted && res?.status === 'EXPIRED') {
          setExpired(true);
        }
      } catch (e) {
        // ignore errors - don't reveal billing info
      }
    }

    load();

    return () => { mounted = false; };
  }, [token, role]);

  if (!expired) return null;

  return (
    <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
      Your organization's subscription has expired. Please contact your organization owner.
    </div>
  );
}
