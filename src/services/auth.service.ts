// src/services/auth.service.ts

import axios from 'axios';
import { LoginCredentials, RegisterCredentials } from '../types/auth';

const API_URL = 'https://your-backend-api.com/api/auth';

const login = async (credentials: LoginCredentials) => {
  const res = await axios.post(`${API_URL}/login`, credentials);
  return res.data;
};

const register = async (data: RegisterCredentials) => {
  const res = await axios.post(`${API_URL}/register`, data);
  return res.data;
};

const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return { token, user };
};

const logout = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export default { login, register, getCurrentUser, logout };
