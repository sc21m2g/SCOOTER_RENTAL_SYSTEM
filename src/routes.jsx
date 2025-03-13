import React from 'react';  
import { Routes, Route, Navigate } from 'react-router-dom';  
import { useAuth } from './contexts/AuthContext';  

// Common Components  
import ProtectedRoute from './components/common/ProtectedRoute';  
import Map from './components/common/Map';  

// User Components  
import Login from './components/user/login';  
import Register from './components/user/Register';  
import Profile from './components/user/Profile';  
import PaymentInfo from './components/user/PaymentInfo';  

// Scooter Components  
import ScooterList from './components/scooters/ScooterList';  
import ScooterDetails from './components/scooters/ScooterDetails';  
import RentalForm from './components/scooters/RentalForm';  
import RentalHistory from './components/scooters/RentalHistory';  

// Admin Components  
import Dashboard from './components/admin/Dashboard';  
import UserManagement from './components/admin/UserManagement';  
import ScooterManagement from './components/admin/ScooterManagement';  
import IssuesList from './components/admin/IssuesList';  
import PricingSettings from './components/admin/PricingSettings';  

const AppRoutes = () => {  
  const { isAuthenticated, isAdmin } = useAuth();  

  return (  
    <Routes>  
      {/* 公共路由 */}  
      <Route path="/login" element={<Login />} />  
      <Route path="/register" element={<Register />} />  
      <Route path="/map" element={<Map />} />  
      
      {/* 需要登录的用户路由 */}  
      <Route element={<ProtectedRoute isAllowed={isAuthenticated} redirectPath="/login" />}>  
        <Route path="/profile" element={<Profile />} />  
        <Route path="/payment" element={<PaymentInfo />} />  
        <Route path="/scooters" element={<ScooterList />} />  
        <Route path="/scooters/:id" element={<ScooterDetails />} />  
        <Route path="/scooters/:id/rent" element={<RentalForm />} />  
        <Route path="/rentals" element={<RentalHistory />} />  
      </Route>  
      
      {/* 需要管理员权限的路由 */}  
      <Route   
        element={  
          <ProtectedRoute   
            isAllowed={isAuthenticated && isAdmin}   
            redirectPath="/login"   
          />  
        }  
      >  
        <Route path="/admin" element={<Dashboard />} />  
        <Route path="/admin/users" element={<UserManagement />} />  
        <Route path="/admin/scooters" element={<ScooterManagement />} />  
        <Route path="/admin/issues" element={<IssuesList />} />  
        <Route path="/admin/pricing" element={<PricingSettings />} />  
      </Route>  
      
      {/* 根路径重定向 */}  
      <Route   
        path="/"   
        element={  
          isAuthenticated   
            ? <Navigate to="/scooters" replace />   
            : <Navigate to="/login" replace />  
        }   
      />  
      
      {/* 404处理 */}  
      <Route path="*" element={<Navigate to="/" replace />} />  
    </Routes>  
  );  
};

export default AppRoutes;