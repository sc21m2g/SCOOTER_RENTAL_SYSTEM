import React, { createContext, useState, useEffect, useContext } from 'react';  
import { useNavigate } from 'react-router-dom';  
import authService from '../services/auth.service';  

export const AuthContext = createContext();  

export const useAuth = () => {  
  return useContext(AuthContext);  
};  

export const AuthProvider = ({ children }) => {  
  const [currentUser, setCurrentUser] = useState(null);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState('');  
  const navigate = useNavigate();  

  useEffect(() => {  
    // 检查本地存储中的用户会话  
    const user = localStorage.getItem('user');  
    if (user) {  
      setCurrentUser(JSON.parse(user));  
    }  
    setLoading(false);  
  }, []);  

  const login = async (email, password) => {  
    try {  
      setLoading(true);  
      const userData = await authService.login(email, password);  
      setCurrentUser(userData);  
      localStorage.setItem('user', JSON.stringify(userData));  
      setError('');  
      return userData;  
    } catch (err) {  
      setError(err.response?.data?.message || '登录失败');  
      throw err;  
    } finally {  
      setLoading(false);  
    }  
  };  

  const register = async (userDetails) => {  
    try {  
      setLoading(true);  
      const userData = await authService.register(userDetails);  
      setError('');  
      return userData;  
    } catch (err) {  
      setError(err.response?.data?.message || '注册失败');  
      throw err;  
    } finally {  
      setLoading(false);  
    }  
  };  

  const logout = () => {  
    authService.logout();  
    setCurrentUser(null);  
    localStorage.removeItem('user');  
    navigate('/login');  
  };  

  const value = {  
    currentUser,  
    loading,  
    error,  
    login,  
    register,  
    logout,  
    isAdmin: currentUser?.role === 'admin',  
    isAuthenticated: !!currentUser  
  };  

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;  
};