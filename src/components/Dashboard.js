import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { fetchPrices, fetchInventory, calculateProfitability } from '../services/api';
import { TrendingUp, TrendingDown, Zap, Cpu, Battery, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState({
    prices: [],
    inventory: null,
    profitability: null
  });
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('1h');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prices, inventory] = await Promise.all([
          fetchPrices(),
          fetchInventory()
        ]);
        
        const profitability = calculateProfitability(inventory, prices);
        setData({ prices, inventory, profitability });
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 60000); // 1 minute for dashboard
    return () => clearInterval(interval);
  }, []);

  const formatChartData = (prices) => {
    return prices.slice().reverse().map((price, index) => ({
      time: new Date(price.timestamp).toLocaleTimeString(),
      energy: price.energy_price,
      hash: price.hash_price,
      token: price.token_price,
      index
    }));
  };

  const formatProfitabilityData = (profitability) => {
    if (!profitability) return [];
    
    const miners = profitability.miners.map(m => ({
      name: m.type.replace('_', ' ').toUpperCase(),
      profit: m.profit,
      efficiency: m.efficiency,
      type: 'miner'
    }));
    
    const inference = profitability.inference.map(i => ({
      name: i.type.replace('_', ' ').toUpperCase(),
      profit: i.profit,
      efficiency: i.efficiency,
      type: 'inference'
    }));
    
    return [...miners, ...inference];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-orange-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const chartData = formatChartData(data.prices);
  const profitabilityData = formatProfitabilityData(data.profitability);
  const latestPrice = data.prices[0] || {};

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-orange-400 mb-2">Operations Dashboard</h1>
          <p className="text-gray-400">Real-time monitoring and analytics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Zap className="w-5 h-5 text-yellow-400 mr-2" />
                <span className="text-sm text-gray-400">Energy Price</span>
              </div>
              {data.prices.length >= 2 && (
                latestPrice.energy_price > data.prices[1].energy_price ? 
                <TrendingUp className="w-4 h-4 text-red-400" /> : 
                <TrendingDown className="w-4 h-4 text-green-400" />
              )}
            </div>
            <div className="text-2xl font-bold text-white">
              ${latestPrice.energy_price?.toFixed(4) || '0.0000'}
            </div>
            <div className="text-xs text-gray-500">per kWh</div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Cpu className="w-5 h-5 text-blue-400 mr-2" />
                <span className="text-sm text-gray-400">Hash Price</span>
              </div>
              {data.prices.length >= 2 && (
                latestPrice.hash_price > data.prices[1].hash_price ? 
                <TrendingUp className="w-4 h-4 text-green-400" /> : 
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
            </div>
            <div className="text-2xl font-bold text-white">
              ${latestPrice.hash_price?.toFixed(2) || '0.00'}
            </div>
            <div className="text-xs text-gray-500">per TH/s</div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Battery className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-sm text-gray-400">Token Price</span>
              </div>
              {data.prices.length >= 2 && (
                latestPrice.token_price > data.prices[1].token_price ? 
                <TrendingUp className="w-4 h-4 text-green-400" /> : 
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
            </div>
            <div className="text-2xl font-bold text-white">
              ${latestPrice.token_price?.toFixed(3) || '0.000'}
            </div>
            <div className="text-xs text-gray-500">per token</div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-orange-400 mr-2" />
                <span className="text-sm text-gray-400">Total Profit</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-white">
              ${data.profitability ? 
                (data.profitability.miners.reduce((sum, m) => sum + m.profit, 0) + 
                 data.profitability.inference.reduce((sum, i) => sum + i.profit, 0)).toFixed(0) : 
                '0'}
            </div>
            <div className="text-xs text-gray-500">per hour</div>
          </div>
        </div>

        {/* Price Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-4">Energy & Hash Prices</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="energy" 
                  stroke="#EAB308" 
                  strokeWidth={2}
                  name="Energy Price"
                />
                <Line 
                  type="monotone" 
                  dataKey="hash" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Hash Price"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-4">Token Price Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="token" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Token Price"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profitability Analysis */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Asset Profitability</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={profitabilityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar 
                dataKey="profit" 
                fill="#F97316"
                name="Profit ($/hour)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory Status */}
        {data.inventory && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-4">Mining Assets</h3>
              <div className="space-y-3">
                {Object.entries(data.inventory.miners).map(([type, stats]) => (
                  <div key={type} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-medium text-white capitalize">{type} Miners</div>
                      <div className="text-sm text-gray-400">
                        {stats.hashrate} TH/s • {stats.power}W
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">
                        ${(stats.hashrate * (latestPrice.hash_price || 0) - stats.power * (latestPrice.energy_price || 0) / 1000).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">$/hour</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-4">Inference Assets</h3>
              <div className="space-y-3">
                {Object.entries(data.inventory.inference).map(([type, stats]) => (
                  <div key={type} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-medium text-white capitalize">{type} Inference</div>
                      <div className="text-sm text-gray-400">
                        {stats.tokens} tokens • {stats.power}W
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">
                        ${(stats.tokens * (latestPrice.token_price || 0) - stats.power * (latestPrice.energy_price || 0) / 1000).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">$/hour</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;