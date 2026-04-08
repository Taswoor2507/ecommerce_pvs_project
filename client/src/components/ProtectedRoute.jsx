import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import LoadingSpinner from './ui/LoadingSpinner.jsx';

export const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect logic: save attempted destination for redirecting back
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    // Basic user trying to access admin dashboard -> throw them home
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
