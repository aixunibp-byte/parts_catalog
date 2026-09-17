import { useEffect, useState } from 'react';
import { getAdminToken } from './adminApi';

export default function useAdminGuard() {
  const [isAuthorized, setIsAuthorized] = useState(Boolean(getAdminToken()));

  useEffect(() => {
    setIsAuthorized(Boolean(getAdminToken()));
  }, []);

  return { isAuthorized };
}
