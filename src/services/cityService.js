// src/services/cityService.js
import axios from 'axios';

const CSC_API_BASE = 'https://api.countrystatecity.in/v1';
const API_KEY = import.meta.env.VITE_CSC_API_KEY;

class CityService {
  constructor() {
    this.api = axios.create({
      baseURL: CSC_API_BASE,
      headers: {
        'X-CSCAPI-KEY': API_KEY
      }
    });
  }

  // Get all countries
  async getCountries() {
    try {
      const response = await this.api.get('/countries');
      return response.data;
    } catch (error) {
      console.error('Error fetching countries:', error);
      return [];
    }
  }

  // Get states for a specific country (India has iso2 'IN')
  async getStatesByCountry(countryCode = 'IN') {
    try {
      const response = await this.api.get(`/countries/${countryCode}/states`);
      return response.data;
    } catch (error) {
      console.error('Error fetching states:', error);
      return [];
    }
  }

  // Get cities for a specific state in India
  async getCitiesByState(stateCode, countryCode = 'IN') {
    try {
      const response = await this.api.get(`/countries/${countryCode}/states/${stateCode}/cities`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  }

  // Get all Indian cities (across all states)
  async getAllIndianCities() {
    try {
      const states = await this.getStatesByCountry('IN');
      let allCities = [];
      
      for (const state of states) {
        const cities = await this.getCitiesByState(state.iso2);
        allCities = [...allCities, ...cities];
      }
      
      return allCities.map(city => city.name).sort();
    } catch (error) {
      console.error('Error fetching all cities:', error);
      return [];
    }
  }
}

export default new CityService();