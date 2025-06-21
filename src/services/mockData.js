// Mock data for development when API is not available

export const mockPrices = [
  {
    energy_price: 0.0647,
    hash_price: 8.44,
    timestamp: new Date().toISOString(),
    token_price: 2.91
  },
  {
    energy_price: 0.0681,
    hash_price: 9.25,
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    token_price: 2.53
  },
  {
    energy_price: 0.0649,
    hash_price: 8.32,
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    token_price: 3.0
  },
  {
    energy_price: 0.0712,
    hash_price: 7.89,
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    token_price: 2.87
  },
  {
    energy_price: 0.0698,
    hash_price: 8.01,
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    token_price: 2.95
  }
];

export const mockInventory = {
  inference: {
    asic: {
      power: 15000,
      tokens: 50000
    },
    gpu: {
      power: 5000,
      tokens: 1000
    }
  },
  miners: {
    air: {
      hashrate: 1000,
      power: 3500
    },
    hydro: {
      hashrate: 5000,
      power: 5000
    },
    immersion: {
      hashrate: 10000,
      power: 10000
    }
  }
};

export const fetchMockPrices = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockPrices;
};

export const fetchMockInventory = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockInventory;
};