import { useNavigate } from 'react-router-dom';
import api from '@/api';

export const login = async (username, password) => {
  try {
    const response = await api.post('/users/login', { username, password });
    
    // Store the token and user info
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('isAdminAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('isAdminAuthenticated');
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  return localStorage.getItem('isAdminAuthenticated') === 'true';
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
