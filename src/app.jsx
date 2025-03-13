import React, { useEffect, useState } from 'react';  
import { Routes, Route, useLocation } from 'react-router-dom';  
import { AuthProvider } from './contexts/AuthContext';  
import { RentalProvider } from './contexts/RentalContext';  
import Header from './components/common/Header';  
import Footer from './components/common/Footer';  
import Sidebar from './components/common/Sidebar';  
import AppRoutes from './routes';  
import './styles/App.css';  

const App = () => {  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);  
  const location = useLocation();  

  // Close sidebar on route change  
  useEffect(() => {  
    setIsSidebarOpen(false);  
  }, [location]);  

  // Toggle sidebar function  
  const toggleSidebar = () => {  
    setIsSidebarOpen(!isSidebarOpen);  
  };  

  return (  
    <AuthProvider>  
      <RentalProvider>  
        <div className="app-container">  
          <Header toggleSidebar={toggleSidebar} />  
          
          <div className="content-wrapper">  
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />  
            
            <main className="main-content">  
              <AppRoutes />  
            </main>  
          </div>  
          
          <Footer />  
        </div>  
      </RentalProvider>  
    </AuthProvider>  
  );  
};  

export default App;