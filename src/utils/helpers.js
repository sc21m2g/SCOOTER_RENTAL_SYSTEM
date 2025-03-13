/**  
 * Utility functions for the scooter rental application  
 */  

// Format currency to Chinese Yuan  
export const formatCurrency = (amount) => {  
    return new Intl.NumberFormat('zh-CN', {  
      style: 'currency',  
      currency: 'CNY',  
      minimumFractionDigits: 2  
    }).format(amount);  
  };  
  
  // Format date to local format  
  export const formatDate = (dateString) => {  
    const options = { year: 'numeric', month: 'long', day: 'numeric' };  
    return new Date(dateString).toLocaleDateString('zh-CN', options);  
  };  
  
  // Format date and time  
  export const formatDateTime = (dateString) => {  
    const options = {   
      year: 'numeric',   
      month: 'long',   
      day: 'numeric',  
      hour: '2-digit',  
      minute: '2-digit'  
    };  
    return new Date(dateString).toLocaleString('zh-CN', options);  
  };  
  
  // Calculate duration between two dates in minutes  
  export const calculateDurationInMinutes = (startTime, endTime) => {  
    const start = new Date(startTime);  
    const end = endTime ? new Date(endTime) : new Date();  
    return Math.round((end - start) / (1000 * 60));  
  };  
  
  // Format duration in human-readable format  
  export const formatDuration = (minutes) => {  
    if (minutes < 60) {  
      return `${minutes} 分钟`;  
    }  
    
    const hours = Math.floor(minutes / 60);  
    const remainingMinutes = minutes % 60;  
    
    if (remainingMinutes === 0) {  
      return `${hours} 小时`;  
    } else {  
      return `${hours} 小时 ${remainingMinutes} 分钟`;  
    }  
  };  
  
  // Calculate rental cost based on duration and rate  
  export const calculateRentalCost = (durationInMinutes, ratePerMinute, baseRate = 0) => {  
    return baseRate + (durationInMinutes * ratePerMinute);  
  };  
  
  // Get scooter battery color based on level  
  export const getBatteryLevelColor = (level) => {  
    if (level >= 70) return 'success';  
    if (level >= 30) return 'warning';  
    return 'danger';  
  };  
  
  // Get scooter status text in Chinese  
  export const getScooterStatusText = (status) => {  
    const statusMap = {  
      'available': '可用',  
      'rented': '已租用',  
      'maintenance': '维修中',  
      'charging': '充电中',  
      'reserved': '已预订',  
      'offline': '离线'  
    };  
    
    return statusMap[status] || status;  
  };  
  
  // Get user-friendly rental status text  
  export const getRentalStatusText = (status) => {  
    const statusMap = {  
      'active': '进行中',  
      'completed': '已完成',  
      'cancelled': '已取消',  
      'reserved': '已预订',  
      'unlocked': '已解锁'  
    };  
    
    return statusMap[status] || status;  
  };  
  
  // Calculate distance between two GPS coordinates in kilometers  
  export const calculateDistance = (lat1, lon1, lat2, lon2) => {  
    const R = 6371; // Radius of the Earth in km  
    const dLat = (lat2 - lat1) * (Math.PI / 180);  
    const dLon = (lon2 - lon1) * (Math.PI / 180);  
    const a =   
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +  
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *   
      Math.sin(dLon / 2) * Math.sin(dLon / 2);   
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));   
    const distance = R * c; // Distance in km  
    return distance;  
  };  
  
  // Get user location as a promise  
  export const getUserLocation = () => {  
    return new Promise((resolve, reject) => {  
      if (!navigator.geolocation) {  
        reject(new Error('您的浏览器不支持地理位置功能'));  
      } else {  
        navigator.geolocation.getCurrentPosition(  
          position => {  
            resolve({  
              latitude: position.coords.latitude,  
              longitude: position.coords.longitude  
            });  
          },  
          error => {  
            let errorMessage = '获取位置信息失败';  
            
            switch (error.code) {  
              case error.PERMISSION_DENIED:  
                errorMessage = '您拒绝了位置请求权限';  
                break;  
              case error.POSITION_UNAVAILABLE:  
                errorMessage = '位置信息不可用';  
                break;  
              case error.TIMEOUT:  
                errorMessage = '获取位置请求超时';  
                break;  
            }  
            
            reject(new Error(errorMessage));  
          }  
        );  
      }  
    });  
  };  
  
  // Truncate text with ellipsis  
  export const truncateText = (text, maxLength) => {  
    if (text.length <= maxLength) return text;  
    return text.substr(0, maxLength) + '...';  
  };  
  
  // Generate random ID (for development/testing purposes)  
  export const generateId = (prefix = '') => {  
    return `${prefix}${Math.random().toString(36).substr(2, 9)}`;  
  };  
  
  // Get days ago date  
  export const getDaysAgo = (days) => {  
    const date = new Date();  
    date.setDate(date.getDate() - days);  
    return date;  
  };  
  
  // Check if device is mobile  
  export const isMobileDevice = () => {  
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);  
  };