import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LockKeyhole } from 'lucide-react';

const AuthLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // If authenticated, redirect to dashboard
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg transition-all duration-300 transform hover:shadow-xl">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-indigo-100 p-2 flex items-center justify-center">
            <LockKeyhole className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Content Publishing Platform
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage your content with role-based access control
          </p>
        </div>
        
        <div className="mt-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;