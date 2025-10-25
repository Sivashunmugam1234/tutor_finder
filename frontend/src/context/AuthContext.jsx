import React, { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        console.log('Loading user from localStorage:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user info from localStorage:', error);
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    const userData = response.data.data; // Extract user data from nested structure
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
    return userData; // Return user data for redirect logic
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  const updateUser = (userData) => {
    console.log('Updating user in context:', userData);
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const isAuthenticated = !!user;
  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateUser,
      isAuthenticated, 
      isTeacher, 
      isStudent, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;