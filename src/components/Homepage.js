import React, { useState, useEffect } from 'react';
import { fetchPrices, fetchInventory, calculateProfitability } from '../services/api';
import { WattsonAI } from '../utils/wattsonAI';
import { AlertTriangle, TrendingUp, Battery, Zap } from 'lucide-react';
import LiquidGlass from './LiquidGlass';

const Homepage = () => {
  const [data, setData] = useState({
    prices: [],
    inventory: null,
    profitability: null
  });
  const [aiStatus, setAiStatus] = useState({ status: 'green', message: '', confidence: 0 });
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  
  const wattson = new WattsonAI();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prices, inventory] = await Promise.all([
          fetchPrices(),
          fetchInventory()
        ]);
        
        const profitability = calculateProfitability(inventory, prices);
        const status = wattson.analyzeMarketStatus(profitability, prices);
        
        setData({ prices, inventory, profitability });
        setAiStatus(status);
        
        const newNotifications = generateNotifications(prices, profitability);
        setNotifications(newNotifications);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  const generateNotifications = (prices, profitability) => {
    const notifications = [];
    
    if (prices.length >= 2) {
      const current = prices[0];
      const previous = prices[1];
      const energyChange = ((current.energy_price - previous.energy_price) / previous.energy_price) * 100;
      
      if (Math.abs(energyChange) > 10) {
        notifications.push({
          id: 1,
          type: energyChange > 0 ? 'warning' : 'success',
          message: `Energy price ${energyChange > 0 ? 'spike' : 'drop'}: ${Math.abs(energyChange).toFixed(1)}%`,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    }

    if (profitability) {
      const negativeAssets = [...profitability.miners, ...profitability.inference]
        .filter(asset => asset.profit < 0);
      
      if (negativeAssets.length > 0) {
        notifications.push({
          id: 2,
          type: 'warning',
          message: `${negativeAssets.length} asset(s) showing negative returns`,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    }

    return notifications;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'green': return <TrendingUp className="w-8 h-8 text-green-400" />;
      case 'yellow': return <AlertTriangle className="w-8 h-8 text-yellow-400" />;
      case 'red': return <AlertTriangle className="w-8 h-8 text-red-400" />;
      default: return <Zap className="w-8 h-8 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-orange-400">Wattson is analyzing market conditions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-orange-400 mb-2">Wattson AI</h1>
          <p className="text-gray-400">Enterprise Mining Operations Intelligence</p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">System Status</h3>
              {getStatusIcon(aiStatus.status)}
            </div>
            <div className="flex items-center mb-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(aiStatus.status)} mr-2`}></div>
              <span className="text-lg font-medium capitalize text-white">{aiStatus.status}</span>
            </div>
            <p className="text-gray-300 text-sm mb-2">{aiStatus.message}</p>
            <div className="text-xs text-gray-500">
              Confidence: {aiStatus.confidence}%
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Energy Price</h3>
              <Zap className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              ${data.prices[0]?.energy_price?.toFixed(3) || '0.000'}/kWh
            </div>
            <div className="text-sm text-gray-400">
              {data.prices.length >= 2 && (
                <span className={
                  data.prices[0].energy_price > data.prices[1].energy_price 
                    ? 'text-red-400' : 'text-green-400'
                }>
                  {((data.prices[0].energy_price - data.prices[1].energy_price) / data.prices[1].energy_price * 100).toFixed(1)}%
                </span>
              )}
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Hash Price</h3>
              <Battery className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              ${data.prices[0]?.hash_price?.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-gray-400">
              {data.prices.length >= 2 && (
                <span className={
                  data.prices[0].hash_price > data.prices[1].hash_price 
                    ? 'text-green-400' : 'text-red-400'
                }>
                  {((data.prices[0].hash_price - data.prices[1].hash_price) / data.prices[1].hash_price * 100).toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">AI Notifications</h3>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-center p-3 bg-gray-800 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    notification.type === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{notification.message}</p>
                    <p className="text-gray-500 text-xs">{notification.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Insights with Liquid Glass Effect */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-xl font-semibold text-white mb-4">Wattson's Quick Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-800 rounded-lg">
              <p className="text-gray-300 text-sm mb-2">
                "Elementary observation: Current market conditions show optimal arbitrage potential between energy and inference markets."
              </p>
              <div className="text-xs text-gray-500">Confidence: 87%</div>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <p className="text-gray-300 text-sm mb-2">
                "Most intriguing: GPU inference operations demonstrate 23% higher efficiency during current energy windows."
              </p>
              <div className="text-xs text-gray-500">Confidence: 82%</div>
            </div>
          </div>
          
          {/* Liquid Glass Accent */}
          <div className="flex justify-center mt-6">
            <LiquidGlass width={200} height={120} className="opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;