import React from 'react';  
import { Navigate, useLocation } from 'react-router-dom';  
import { useAuth } from '../../contexts/AuthContext';  
import { Spinner } from 'react-bootstrap';  
import { jwtDecode } from 'jwt-decode';  

const ProtectedRoute = ({ children, requiredRoles = [] }) => {  
  const { isAuthenticated, user, loading, token } = useAuth();  
  const location = useLocation();  
  
  // Show loading spinner while auth state is being checked  
  if (loading) {  
    return (  
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>  
        <Spinner animation="border" variant="primary" />  
        <span className="ms-2">验证身份...</span>  
      </div>  
    );  
  }  

  // If not authenticated, redirect to login  
  if (!isAuthenticated) {  
    // Save the location the user was trying to access  
    return <Navigate to="/login" state={{ from: location }} replace />;  
  }  
  
  // If roles are specified, check if user has required role  
  if (requiredRoles.length > 0) {  
    // Extract user role from JWT token or user object  
    let userRoles = [];  
    
    // Try to get roles from token payload  
    if (token) {  
      try {  
        const decoded = jwtDecode(token);  
        userRoles = decoded.roles || [];  
      } catch (error) {  
        console.error('Error decoding JWT token:', error);  
      }  
    }  
    
    // Fallback to user object if roles not found in token  
    if (!userRoles.length && user && user.roles) {  
      userRoles = user.roles;  
    }  
    
    // Check if user has any of the required roles  
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));  
    
    if (!hasRequiredRole) {  
      // User is authenticated but doesn't have the required role  
      return <Navigate to="/unauthorized" replace />;  
    }  
  }  

  // User is authenticated and has the required role (if specified)  
  return children;  
};  

export default ProtectedRoute;