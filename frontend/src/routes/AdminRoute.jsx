import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isInitializing } = useAuth();

  if (isInitializing) {
    return <div className="page-loader">Loading...</div>;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  if (children) {
    return children;
  }

  return <Outlet />;
};

export default AdminRoute;
