import { fetchMockInventory, fetchMockPrices } from './mockData';

import axios from 'axios';

const BASE_URL = 'https://wattsonai.onrender.com/api';
const USE_MOCK_DATA = false; // Set to false to use real API backend

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const fetchInventory = async () => {
  if (USE_MOCK_DATA) {
    return await fetchMockInventory();
  }
  
  try {
    const response = await api.get('/inventory');
    console.log('Inventory response from local backend:', response.data);
    return response.data.data; // Extract data from our backend response
  } catch (error) {
    console.error('Error fetching inventory from local backend, using mock data:', error);
    return await fetchMockInventory();
  }
};

export const fetchPrices = async () => {
  if (USE_MOCK_DATA) {
    return await fetchMockPrices();
  }
  
  try {
    const response = await api.get('/prices');
    console.log('Prices response from local backend:', response.data);
    return response.data.data; // Extract data from our backend response
  } catch (error) {
    console.error('Error fetching prices from local backend, using mock data:', error);
    return await fetchMockPrices();
  }
};

export const fetchMachines = async (apiKey) => {
  if (!apiKey) {
    console.error('API key is required to fetch machines data');
    return null;
  }
  
  try {
    const response = await fetch('http://localhost:3001/api/machines', {
      headers: {
        'X-Api-Key': apiKey
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Machines response from local backend:', result);
    return result.data; // Extract data from our backend response
  } catch (error) {
    console.error('Error fetching machines from local backend:', error);
    return null;
  }
};

export const updateMachines = async (apiKey, allocation) => {
  if (!apiKey) {
    console.error('API key is required to update machines');
    return null;
  }
  
  try {
    const response = await fetch('http://localhost:3001/api/machines', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey
      },
      body: JSON.stringify(allocation)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error updating machines:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Machines updated successfully:', result);
    return result.data;
  } catch (error) {
    console.error('Error updating machines from local backend:', error);
    throw error;
  }
};

export const createSite = async (siteName) => {
  try {
    const response = await api.post('/sites', {
      name: siteName,
      api_key: "947a8153-edf4-4093-aa92-e6efe0bd2682",
      power: 1000000
    });
    return response.data;
  } catch (error) {
    console.error('Error creating site:', error);
    throw error;
  }
};

export const calculateProfitability = (inventory, prices) => {
  if (!inventory || !prices || prices.length === 0) return null;
  
  const latestPrice = prices[0];
  const { energy_price, hash_price, token_price } = latestPrice;
  
  const miners = inventory.miners;
  const inference = inventory.inference;
  
  const minerProfits = Object.entries(miners).map(([type, stats]) => ({
    type: `${type}_miner`,
    profit: (stats.hashrate * hash_price) - (stats.power * energy_price / 1000),
    efficiency: stats.hashrate / stats.power
  }));
  
  const inferenceProfits = Object.entries(inference).map(([type, stats]) => ({
    type: `${type}_inference`,
    profit: (stats.tokens * token_price) - (stats.power * energy_price / 1000),
    efficiency: stats.tokens / stats.power
  }));
  
  return {
    miners: minerProfits,
    inference: inferenceProfits,
    energy_price,
    hash_price,
    token_price
  };
};