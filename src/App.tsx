import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleBasedRoute from './components/auth/RoleBasedRoute';
import { UserRole } from './types/auth';

// Lazy-loaded components
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const ContentList = lazy(() => import('./pages/content/ContentList'));
const ContentCreate = lazy(() => import('./pages/content/ContentCreate'));
const ContentEdit = lazy(() => import('./pages/content/ContentEdit'));
const NotFound = lazy(() => import('./pages/NotFound'));

const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/content" element={<ContentList />} />
          
          {/* Admin and Super Admin only routes */}
          <Route 
            path="/content/create" 
            element={
              <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                <ContentCreate />
              </RoleBasedRoute>
            } 
          />
          
          {/* Super Admin only routes */}
          <Route 
            path="/content/edit/:id" 
            element={
              <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                <ContentEdit />
              </RoleBasedRoute>
            } 
          />
        </Route>

        {/* Redirect root to dashboard or login */}
        <Route path="/" element={<Navigate to="/dashboard\" replace />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;