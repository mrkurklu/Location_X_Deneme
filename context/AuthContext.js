import { createContext, useContext, useMemo } from 'react';
import { useSession } from 'next-auth/react';

const AuthContext = createContext({ user: null });

export function AuthProvider({ children }) {
  const { data: session } = useSession();
  const value = useMemo(() => ({ user: session?.user || null }), [session]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useRole() {
  const { user } = useAuth();
  return user?.role || null;
}

export function RequireRole({ roles, fallback = null, children }) {
  const role = useRole();
  if (!roles || roles.includes(role)) return children;
  return fallback;
}


