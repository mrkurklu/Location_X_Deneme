import { getServerSession } from 'next-auth/next';
import { authOptions } from '../pages/api/auth/[...nextauth]';

export const Roles = {
  Admin: 'Admin',
  SalesManager: 'Sales Manager',
  StockManager: 'Stock Manager',
};

export function hasRole(user, roles) {
  if (!user) return false;
  const allowed = Array.isArray(roles) ? roles : [roles];
  return allowed.includes(user.role);
}

export async function requireApiAuth(req, res, allowedRoles) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return { ok: false, status: 401, message: 'Unauthorized' };
  }
  if (allowedRoles && !hasRole(session.user, allowedRoles)) {
    return { ok: false, status: 403, message: 'Forbidden' };
  }
  return { ok: true, user: session.user };
}


