import axios from 'axios';  

// 创建一个axios实例  
const API = axios.create({  
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',  
  headers: {  
    'Content-Type': 'application/json',  
  }  
});  

// 请求拦截器 - 添加认证token  
API.interceptors.request.use((config) => {  
  const user = JSON.parse(localStorage.getItem('user') || '{}');  
  if (user.token) {  
    config.headers.Authorization = `Bearer ${user.token}`;  
  }  
  return config;  
}, (error) => {  
  return Promise.reject(error);  
});  

// 响应拦截器 - 处理常见错误  
API.interceptors.response.use(  
  (response) => response.data,  
  (error) => {  
    // 处理401错误 - 用户未授权  
    if (error.response && error.response.status === 401) {  
      localStorage.removeItem('user');  
      window.location.href = '/login';  
    }  
    return Promise.reject(error);  
  }  
);  

export default API;