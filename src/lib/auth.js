import { useNavigate } from 'react-router-dom';
import api from '@/api';

export const login = async (username, password) => {
  try {
    const response = await api.post('/users/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.location.href = '/admin/login'; // Force redirect using window location
};

export const isAuthenticated = () => {
  // Check if token exists
  return !!localStorage.getItem('authToken');
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const getCurrentUser = () => {
  const userString = localStorage.getItem('user');
  if (userString) {
    return JSON.parse(userString);
  }
  return null;
};

export function useAuth() {
  const navigate = useNavigate();

  const requireAuth = () => {
    if (!isAuthenticated()) {
      navigate('/admin/login');
    }
  };

  return { requireAuth };
}
