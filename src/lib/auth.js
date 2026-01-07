import { useNavigate } from 'react-router-dom';
import api from '@/api';

export const login = async (username, password) => {
  // Login is now bypassed, always return true
  return true;
};

// ...

export const isAuthenticated = () => {
  return true; // Always authenticated
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
