import api from './api';  

class ScooterService {  
  // Get all available scooters  
  async getAvailableScooters() {  
    try {  
      const response = await api.get('/scooters/available');  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Get scooters near a location  
  async getScootersNearby(latitude, longitude, radius = 2) {  
    try {  
      const response = await api.get('/scooters/nearby', {  
        params: { latitude, longitude, radius }  
      });  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Get scooter details by ID  
  async getScooterById(scooterId) {  
    try {  
      const response = await api.get(`/scooters/${scooterId}`);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Update scooter status  
  async updateScooterStatus(scooterId, status) {  
    try {  
      const response = await api.put(`/scooters/${scooterId}/status`, { status });  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Report scooter issue  
  async reportScooterIssue(scooterId, issueDetails) {  
    try {  
      const response = await api.post(`/scooters/${scooterId}/issues`, issueDetails);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Get scooter battery level  
  async getScooterBatteryLevel(scooterId) {  
    try {  
      const response = await api.get(`/scooters/${scooterId}/battery`);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Get scooter location  
  async getScooterLocation(scooterId) {  
    try {  
      const response = await api.get(`/scooters/${scooterId}/location`);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Check if scooter is available for rental  
  async checkScooterAvailability(scooterId) {  
    try {  
      const response = await api.get(`/scooters/${scooterId}/availability`);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Reserve a scooter (temporarily hold for user)  
  async reserveScooter(scooterId, userId) {  
    try {  
      const response = await api.post(`/scooters/${scooterId}/reserve`, { userId });  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
  
  // Release a reservation  
  async releaseReservation(scooterId) {  
    try {  
      const response = await api.post(`/scooters/${scooterId}/release-reservation`);  
      return response.data;  
    } catch (error) {  
      throw error;  
    }  
  }  
}  

export default new ScooterService();