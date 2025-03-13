import React, { createContext, useState, useContext, useEffect } from 'react';  
import { AuthContext } from './AuthContext';  
import rentalService from '../services/rental.service';  

export const RentalContext = createContext();  

export const RentalProvider = ({ children }) => {  
  const { currentUser } = useContext(AuthContext);  
  const [activeRental, setActiveRental] = useState(null);  
  const [rentalHistory, setRentalHistory] = useState([]);  
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState('');  

  useEffect(() => {  
    if (currentUser) {  
      loadActiveRental();  
      loadRentalHistory();  
    }  
  }, [currentUser]);  

  const loadActiveRental = async () => {  
    if (!currentUser) return;  
    
    try {  
      setLoading(true);  
      const active = await rentalService.getActiveRental(currentUser.id);  
      setActiveRental(active);  
    } catch (err) {  
      console.error('加载当前租赁信息失败:', err);  
    } finally {  
      setLoading(false);  
    }  
  };  

  const loadRentalHistory = async () => {  
    if (!currentUser) return;  
    
    try {  
      setLoading(true);  
      const history = await rentalService.getRentalHistory(currentUser.id);  
      setRentalHistory(history);  
    } catch (err) {  
      console.error('加载租赁历史失败:', err);  
    } finally {  
      setLoading(false);  
    }  
  };  

  const startRental = async (scooterId, duration) => {  
    try {  
      setLoading(true);  
      const rental = await rentalService.startRental(currentUser.id, scooterId, duration);  
      setActiveRental(rental);  
      return rental;  
    } catch (err) {  
      setError(err.response?.data?.message || '租赁开始失败');  
      throw err;  
    } finally {  
      setLoading(false);  
    }  
  };  

  const endRental = async () => {  
    if (!activeRental) return;  
    
    try {  
      setLoading(true);  
      const result = await rentalService.endRental(activeRental.id);  
      setActiveRental(null);  
      await loadRentalHistory(); // 刷新历史记录  
      return result;  
    } catch (err) {  
      setError(err.response?.data?.message || '结束租赁失败');  
      throw err;  
    } finally {  
      setLoading(false);  
    }  
  };  

  const extendRental = async (additionalDuration) => {  
    if (!activeRental) return;  
    
    try {  
      setLoading(true);  
      const updated = await rentalService.extendRental(activeRental.id, additionalDuration);  
      setActiveRental(updated);  
      return updated;  
    } catch (err) {  
      setError(err.response?.data?.message || '延长租赁失败');  
      throw err;  
    } finally {  
      setLoading(false);  
    }  
  };  

  const value = {  
    activeRental,  
    rentalHistory,  
    loading,  
    error,  
    startRental,  
    endRental,  
    extendRental,  
    refreshRentalData: async () => {  
      await loadActiveRental();  
      await loadRentalHistory();  
    }  
  };  

  return <RentalContext.Provider value={value}>{children}</RentalContext.Provider>;  
};

export const useRental = () => {  
  const context = useContext(RentalContext);  
  if (!context) {  
    throw new Error('useRental必须在RentalProvider内部使用');  
  }  
  return context;  
};