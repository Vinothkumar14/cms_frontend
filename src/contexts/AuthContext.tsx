import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthState, User, LoginCredentials, RegisterCredentials } from '../types/auth';
import AuthService from '../services/auth.service';
import { toast } from 'react-toastify';
import { fetchUserFromApi } from '../services/user'; 


interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
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
  const [user, setUser] = useState(null);


  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const authData = await AuthService.getCurrentUser();
        
        if (authData) {
          setState({
            user: authData.user,
            token: authData.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setState({
            ...initialState,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setState({
          ...initialState,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const authData = await AuthService.login(credentials);
      
      // Store auth data in local storage for persistence
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
      
      // Store auth data in local storage for persistence
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
  const updateUserFromApi = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!storedUser?.id) return;

    const updatedUser = await fetchUserFromApi(storedUser.id);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser); // ✅ This works here
  };

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      await AuthService.logout();
      
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