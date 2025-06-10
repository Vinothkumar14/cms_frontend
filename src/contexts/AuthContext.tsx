import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthState, LoginCredentials, RegisterCredentials } from '../types/auth'; // Removed unused User import
import AuthService from '../services/auth.service';
import { fetchUserWithRole } from '../services/user';
import { toast } from 'react-toastify';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUserFromApi: () => Promise<User | undefined>; // Updated return type
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');
      
      if (token && userString) {
        // const user = JSON.parse(userString);
        // Verify token is still valid
        const authData = await AuthService.getCurrentUser();
        
        if (authData) {
          setState({
            user: authData.user,
            token: authData.token,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }
      }
      
      // If no valid session found
      setState({
        ...initialState,
        isLoading: false,
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Clear invalid auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setState({
        ...initialState,
        isLoading: false,
      });
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  const updateUserFromApi = async (): Promise<User | undefined> => {
    try {
      if (!state.user?.id) return undefined;
      
      const updatedUser = await fetchUserWithRole(state.user.id);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setState(prev => ({
        ...prev,
        user: updatedUser,
      }));
      
      return updatedUser;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const authData = await AuthService.login(credentials);
      
      // Store auth data
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(authData.user));
      
      setState({
        user: authData.user,
        token: authData.token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      toast.success('Login successful');
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  };

  const register = async (userData: RegisterCredentials) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const authData = await AuthService.register(userData);
      
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(authData.user));
      
      setState({
        user: authData.user,
        token: authData.token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      toast.success('Registration successful');
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast.error('Registration failed. Please try again.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      await AuthService.logout();
      
      // Clear all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      toast.success('Logged out successfully');
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUserFromApi,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};