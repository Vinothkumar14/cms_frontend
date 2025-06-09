import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, AlertCircle } from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { LoginCredentials } from '../../types/auth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      await login(data);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login helpers
  const loginAsUser = () => {
    onSubmit({ email: 'user@example.com', password: 'password' });
  };

  const loginAsAdmin = () => {
    onSubmit({ email: 'admin@example.com', password: 'password' });
  };

  const loginAsSuperAdmin = () => {
    onSubmit({ email: 'superadmin@example.com', password: 'password' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sign in to your account</h1>
        <p className="mt-2 text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            create a new account
          </Link>
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span className="ml-2 text-sm text-red-800">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          autoComplete="email"
          leftIcon={<Mail className="h-5 w-5" />}
          error={errors.email?.message}
          fullWidth
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          leftIcon={<Lock className="h-5 w-5" />}
          error={errors.password?.message}
          fullWidth
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              Forgot your password?
            </a>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          className="mt-6"
        >
          Sign in
        </Button>
      </form>

      {/* Demo login buttons */}
      <div className="mt-6 space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Demo accounts</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loginAsUser}
            disabled={isLoading}
          >
            User
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loginAsAdmin}
            disabled={isLoading}
          >
            Admin
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loginAsSuperAdmin}
            disabled={isLoading}
          >
            Super Admin
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;