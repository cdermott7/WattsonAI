import React, { useState, useEffect } from 'react';
import { fetchPrices, fetchInventory, calculateProfitability } from '../services/api';

const ApiTest = () => {
  const [prices, setPrices] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [profitability, setProfitability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('Loading data from local backend...');
        
        const [pricesData, inventoryData] = await Promise.all([
          fetchPrices(),
          fetchInventory()
        ]);
        
        console.log('Prices data:', pricesData);
        console.log('Inventory data:', inventoryData);
        
        setPrices(pricesData);
        setInventory(inventoryData);
        
        const profitData = calculateProfitability(inventoryData, pricesData);
        setProfitability(profitData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="text-xl text-white">Loading data from local backend...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-xl text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">API Integration Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Prices Data */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Prices Data</h2>
          <div className="text-sm text-white/80">
            <p>Total records: {prices?.length || 0}</p>
            {prices && prices.length > 0 && (
              <div className="mt-4">
                <p>Latest prices:</p>
                <ul className="mt-2 space-y-1">
                  <li>Hash Price: ${prices[0].hash_price?.toFixed(2)}</li>
                  <li>Token Price: ${prices[0].token_price?.toFixed(2)}</li>
                  <li>Energy Price: ${prices[0].energy_price?.toFixed(2)}</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Inventory Data */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Inventory Data</h2>
          <div className="text-sm text-white/80">
            {inventory && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white">Miners:</h3>
                  <ul className="mt-2 space-y-1">
                    {Object.entries(inventory.miners || {}).map(([type, stats]) => (
                      <li key={type}>
                        {type}: {stats.hashrate} hashrate, {stats.power}W
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Inference:</h3>
                  <ul className="mt-2 space-y-1">
                    {Object.entries(inventory.inference || {}).map(([type, stats]) => (
                      <li key={type}>
                        {type}: {stats.tokens} tokens, {stats.power}W
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profitability Data */}
        {profitability && (
          <div className="md:col-span-2 bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Profitability Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-white mb-2">Miner Profits:</h3>
                <ul className="space-y-1 text-sm text-white/80">
                  {profitability.miners?.map((miner) => (
                    <li key={miner.type}>
                      {miner.type}: ${miner.profit?.toFixed(2)} profit
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Inference Profits:</h3>
                <ul className="space-y-1 text-sm text-white/80">
                  {profitability.inference?.map((inf) => (
                    <li key={inf.type}>
                      {inf.type}: ${inf.profit?.toFixed(2)} profit
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <div className="text-green-400 text-lg font-semibold">
          ✅ Frontend successfully connected to local backend!
        </div>
        <div className="text-white/60 text-sm mt-2">
          Data is being fetched from http://localhost:3001/api
        </div>
      </div>
    </div>
  );
};

export default ApiTest; 