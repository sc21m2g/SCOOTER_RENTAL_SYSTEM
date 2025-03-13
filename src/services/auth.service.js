import API from './api';  

const authService = {  
  // 模拟后端API - 实际项目中应连接真实后端  
  async login(email, password) {  
    // 在实际项目中, 使用API.post('/auth/login', { email, password })  
    // 这里使用模拟数据进行演示  
    return new Promise((resolve) => {  
      setTimeout(() => {  
        // 模拟用户数据  
        const user = {  
          id: '1',  
          name: '测试用户',  
          email: email,  
          role: email.includes('admin') ? 'admin' : 'user',  
          token: 'mock-jwt-token'  
        };  
        resolve(user);  
      }, 500);  
    });  
  },  
  
  async register(userDetails) {  
    // 在实际项目中, 使用API.post('/auth/register', userDetails)  
    return new Promise((resolve) => {  
      setTimeout(() => {  
        resolve({ success: true });  
      }, 500);  
    });  
  },  
  
  logout() {  
    // 清理本地存储的令牌  
    localStorage.removeItem('user');  
  },  
  
  async getCurrentUser() {  
    const user = localStorage.getItem('user');  
    return user ? JSON.parse(user) : null;  
  }  
};  

export default authService;