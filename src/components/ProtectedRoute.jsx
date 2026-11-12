import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Protected({ roles, children }) {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  if (loading)
    return <div className="p-8 text-center text-muted-foreground">Checking sign-in…</div>;
  if (!user) return <Navigate to="/login" />;
  if (!roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}
