import api from './api';  

class RentalService {  
  // Get all rentals for a user  
  async getUserRentals(userId) {  
    try {  
      const response = await api.get(`/users/${userId}/rentals`);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Get details of a specific rental  
  async getRentalById(rentalId) {  
    try {  
      const response = await api.get(`/rentals/${rentalId}`);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Create a new rental  
  async createRental(userId, scooterId, rentalDetails) {  
    try {  
      const response = await api.post('/rentals', {  
        userId,  
        scooterId,  
        ...rentalDetails  
      });  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Unlock scooter for an active rental  
  async unlockScooter(rentalId) {  
    try {  
      const response = await api.post(`/rentals/${rentalId}/unlock`);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // End a rental  
  async endRental(rentalId, endLocation) {  
    try {  
      const response = await api.post(`/rentals/${rentalId}/end`, endLocation);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Extend a rental  
  async extendRental(rentalId, extensionDetails) {  
    try {  
      const response = await api.post(`/rentals/${rentalId}/extend`, extensionDetails);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Cancel a rental  
  async cancelRental(rentalId) {  
    try {  
      const response = await api.post(`/rentals/${rentalId}/cancel`);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Rate a completed rental  
  async rateRental(rentalId, ratingDetails) {  
    try {  
      const response = await api.post(`/rentals/${rentalId}/rate`, ratingDetails);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Report an issue with a rental  
  async reportIssue(rentalId, issueDetails) {  
    try {  
      const response = await api.post(`/rentals/${rentalId}/issues`, issueDetails);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Get user's active discounts  
  async getUserDiscounts(userId) {  
    try {  
      const response = await api.get(`/users/${userId}/discounts`);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Get rental pricing  
  async getRentalPricing() {  
    try {  
      const response = await api.get('/rentals/pricing');  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Calculate estimated cost for a rental  
  async calculateRentalCost(rentalParams) {  
    try {  
      const response = await api.post('/rentals/calculate-cost', rentalParams);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Get user's rental statistics  
  async getUserRentalStats(userId) {  
    try {  
      const response = await api.get(`/users/${userId}/rental-stats`);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
}  

export default new RentalService();