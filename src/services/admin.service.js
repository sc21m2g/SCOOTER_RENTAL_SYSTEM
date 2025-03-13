import api from './api';  

class AdminService {  
  // Get all users  
  async getAllUsers() {  
    try {  
      const response = await api.get('/admin/users');  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Get user details  
  async getUserDetails(userId) {  
    try {  
      const response = await api.get(`/admin/users/${userId}`);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Update user details  
  async updateUser(userId, userData) {  
    try {  
      const response = await api.put(`/admin/users/${userId}`, userData);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Disable/Enable user account  
  async toggleUserStatus(userId, status) {  
    try {  
      const response = await api.put(`/admin/users/${userId}/status`, { status });  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Get all scooters  
  async getAllScooters() {  
    try {  
      const response = await api.get('/admin/scooters');  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Add new scooter  
  async addScooter(scooterData) {  
    try {  
      const response = await api.post('/admin/scooters', scooterData);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Update scooter details  
  async updateScooter(scooterId, scooterData) {  
    try {  
      const response = await api.put(`/admin/scooters/${scooterId}`, scooterData);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Remove scooter  
  async removeScooter(scooterId) {  
    try {  
      const response = await api.delete(`/admin/scooters/${scooterId}`);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Get all reported issues  
  async getAllIssues() {  
    try {  
      const response = await api.get('/admin/issues');  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Update issue status  
  async updateIssueStatus(issueId, statusData) {  
    try {  
      const response = await api.put(`/admin/issues/${issueId}/status`, statusData);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Respond to issue  
  async respondToIssue(issueId, responseData) {  
    try {  
      const response = await api.post(`/admin/issues/${issueId}/response`, responseData);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Get pricing settings  
  async getPricingSettings() {  
    try {  
      const response = await api.get('/admin/pricing');  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Update pricing settings  
  async updatePricingSettings(pricingData) {  
    try {  
      const response = await api.put('/admin/pricing', pricingData);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Create discount  
  async createDiscount(discountData) {  
    try {  
      const response = await api.post('/admin/discounts', discountData);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Update discount  
  async updateDiscount(discountId, discountData) {  
    try {  
      const response = await api.put(`/admin/discounts/${discountId}`, discountData);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Delete discount  
  async deleteDiscount(discountId) {  
    try {  
      const response = await api.delete(`/admin/discounts/${discountId}`);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Get revenue statistics  
  async getRevenueStats(period) {  
    try {  
      const response = await api.get('/admin/statistics/revenue', {  
        params: { period }  
      });  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Get usage statistics  
  async getUsageStats(period) {  
    try {  
      const response = await api.get('/admin/statistics/usage', {  
        params: { period }  
      });  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Get customer growth statistics  
  async getCustomerGrowthStats(period) {  
    try {  
      const response = await api.get('/admin/statistics/customers', {  
        params: { period }  
      });  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
}  

export default new AdminService();