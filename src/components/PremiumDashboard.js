import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { fetchPrices, fetchInventory, calculateProfitability } from '../services/api';
import { useLiquidGlass } from './SimpleLiquidGlass';
import { TrendingUp, TrendingDown, Zap, Cpu, Brain, Activity, DollarSign } from 'lucide-react';

const PremiumDashboard = () => {
  const [data, setData] = useState({ prices: [], inventory: null, profitability: null });
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('energy');

  // Liquid glass refs for major components
  const chartContainerRef = useLiquidGlass({ width: 800, height: 400 });
  const metricsGridRef = useLiquidGlass({ width: 600, height: 300 });
  const assetsContainerRef = useLiquidGlass({ width: 500, height: 350 });

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
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatChartData = (prices) => {
    return prices.slice().reverse().map((price, index) => ({
      time: new Date(price.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      energy: price.energy_price,
      hash: price.hash_price,
      token: price.token_price,
      index,
      timestamp: price.timestamp
    }));
  };


  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value < 1 ? 4 : 2,
      maximumFractionDigits: value < 1 ? 4 : 2
    }).format(value);
  };

  const getMetricColor = (metric) => {
    switch (metric) {
      case 'energy': return { primary: '#EAB308', secondary: '#F59E0B', gradient: 'from-yellow-500 to-amber-600' };
      case 'hash': return { primary: '#3B82F6', secondary: '#2563EB', gradient: 'from-blue-500 to-blue-600' };
      case 'token': return { primary: '#10B981', secondary: '#059669', gradient: 'from-emerald-500 to-teal-600' };
      default: return { primary: '#6B7280', secondary: '#4B5563', gradient: 'from-gray-500 to-gray-600' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center overflow-hidden">
        {/* Dynamic Background */}
        <div className="fixed inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-60 h-60 bg-purple-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center relative z-10"
        >
          <div className="relative mb-8">
            {/* Animated Chart Icon */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 flex items-center justify-center"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Activity className="w-6 h-6 text-blue-400" />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Data Flow Animation */}
            <div className="flex justify-center space-x-4 mb-6">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [0, -10, 0],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{ 
                    duration: 1.2, 
                    repeat: Infinity, 
                    delay: i * 0.2 
                  }}
                  className="w-3 h-8 bg-gradient-to-t from-blue-500/30 to-blue-500 rounded-full"
                />
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-extralight text-white tracking-tight mb-4">Analytics Dashboard</h2>
            <p className="text-white/60 font-light mb-6">Aggregating real-time performance data...</p>
            
            {/* Loading Progress */}
            <div className="w-64 mx-auto">
              <div className="flex justify-between text-xs text-white/40 mb-2">
                <span>Loading...</span>
                <span>Processing data streams</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                />
              </div>
            </div>
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 space-y-2 text-xs text-white/40"
          >
            <div className="flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full mr-2"
              />
              Connecting to market data feeds...
            </div>
            <div>✓ Fleet monitoring systems online</div>
            <div>✓ Performance metrics calculated</div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const chartData = formatChartData(data.prices);
  const latestPrice = data.prices[0] || {};
  const metricColors = getMetricColor(selectedMetric);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-40 left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-extralight text-white tracking-tight mb-4">
            Operations Analytics
          </h1>
          <p className="text-white/60 text-lg font-light">Real-time performance monitoring and insights</p>
        </div>

        {/* Key Performance Metrics */}
        <div 
          ref={metricsGridRef}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10"
        >
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative text-center p-6">
              <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
              <div className="text-2xl font-light text-white mb-1">
                {formatCurrency(latestPrice.energy_price || 0)}
              </div>
              <div className="text-white/60 text-sm">Energy Price</div>
              {data.prices.length >= 2 && (
                <div className="flex items-center justify-center mt-2 space-x-1">
                  {latestPrice.energy_price > data.prices[1].energy_price ? (
                    <TrendingUp className="w-3 h-3 text-red-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-green-400" />
                  )}
                  <span className={`text-xs ${
                    latestPrice.energy_price > data.prices[1].energy_price ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {Math.abs(((latestPrice.energy_price - data.prices[1].energy_price) / data.prices[1].energy_price) * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative text-center p-6">
              <Cpu className="w-8 h-8 text-blue-500 mx-auto mb-4" />
              <div className="text-2xl font-light text-white mb-1">
                {formatCurrency(latestPrice.hash_price || 0)}
              </div>
              <div className="text-white/60 text-sm">Hash Price</div>
              {data.prices.length >= 2 && (
                <div className="flex items-center justify-center mt-2 space-x-1">
                  {latestPrice.hash_price > data.prices[1].hash_price ? (
                    <TrendingUp className="w-3 h-3 text-green-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-400" />
                  )}
                  <span className={`text-xs ${
                    latestPrice.hash_price > data.prices[1].hash_price ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {Math.abs(((latestPrice.hash_price - data.prices[1].hash_price) / data.prices[1].hash_price) * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative text-center p-6">
              <Brain className="w-8 h-8 text-emerald-500 mx-auto mb-4" />
              <div className="text-2xl font-light text-white mb-1">
                {formatCurrency(latestPrice.token_price || 0)}
              </div>
              <div className="text-white/60 text-sm">Token Price</div>
              {data.prices.length >= 2 && (
                <div className="flex items-center justify-center mt-2 space-x-1">
                  {latestPrice.token_price > data.prices[1].token_price ? (
                    <TrendingUp className="w-3 h-3 text-green-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-400" />
                  )}
                  <span className={`text-xs ${
                    latestPrice.token_price > data.prices[1].token_price ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {Math.abs(((latestPrice.token_price - data.prices[1].token_price) / data.prices[1].token_price) * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-rose-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative text-center p-6">
              <DollarSign className="w-8 h-8 text-orange-500 mx-auto mb-4" />
              <div className="text-2xl font-light text-white mb-1">
                {data.profitability ? 
                  formatCurrency(
                    data.profitability.miners.reduce((sum, m) => sum + m.profit, 0) + 
                    data.profitability.inference.reduce((sum, i) => sum + i.profit, 0)
                  ) : 
                  '$0.00'
                }
              </div>
              <div className="text-white/60 text-sm">Total Profit/Hour</div>
              <div className="flex items-center justify-center mt-2 space-x-1">
                <Activity className="w-3 h-3 text-orange-400 animate-pulse" />
                <span className="text-xs text-orange-400">LIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Chart Section */}
        <div 
          ref={chartContainerRef}
          className="mb-12 p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-light text-white">Market Dynamics</h3>
            <div className="flex space-x-2">
              {['energy', 'hash', 'token'].map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    selectedMetric === metric
                      ? `bg-gradient-to-r ${getMetricColor(metric).gradient} text-white shadow-lg`
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                >
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id={`gradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={metricColors.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={metricColors.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF" 
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Area
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={metricColors.primary}
                  strokeWidth={3}
                  fill={`url(#gradient-${selectedMetric})`}
                  dot={{ fill: metricColors.primary, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: metricColors.primary, strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Asset Performance Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mining Assets */}
          <div 
            ref={assetsContainerRef}
            className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Cpu className="w-6 h-6 text-blue-500" />
              <h3 className="text-xl font-light text-white">Mining Operations</h3>
            </div>
            
            {data.inventory && (
              <div className="space-y-4">
                {Object.entries(data.inventory.miners).map(([type, stats]) => {
                  const profit = stats.hashrate * (latestPrice.hash_price || 0) - stats.power * (latestPrice.energy_price || 0) / 1000;
                  const efficiency = stats.hashrate / stats.power;
                  
                  return (
                    <div key={type} className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="text-white font-medium capitalize">{type} Miners</h4>
                            <p className="text-white/60 text-sm">{stats.hashrate} TH/s • {stats.power}W</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-medium ${profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {formatCurrency(profit)}
                            </div>
                            <div className="text-white/60 text-sm">per hour</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-white/50">
                          <span>Efficiency: {efficiency.toFixed(2)} TH/W</span>
                          <div className={`px-2 py-1 rounded-full ${
                            profit > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {profit > 0 ? 'PROFITABLE' : 'UNPROFITABLE'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Inference Assets */}
          <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <div className="flex items-center space-x-3 mb-6">
              <Brain className="w-6 h-6 text-emerald-500" />
              <h3 className="text-xl font-light text-white">Inference Operations</h3>
            </div>
            
            {data.inventory && (
              <div className="space-y-4">
                {Object.entries(data.inventory.inference).map(([type, stats]) => {
                  const profit = stats.tokens * (latestPrice.token_price || 0) - stats.power * (latestPrice.energy_price || 0) / 1000;
                  const efficiency = stats.tokens / stats.power;
                  
                  return (
                    <div key={type} className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="text-white font-medium capitalize">{type} Inference</h4>
                            <p className="text-white/60 text-sm">{stats.tokens} tokens • {stats.power}W</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-medium ${profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {formatCurrency(profit)}
                            </div>
                            <div className="text-white/60 text-sm">per hour</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-white/50">
                          <span>Efficiency: {efficiency.toFixed(2)} tokens/W</span>
                          <div className={`px-2 py-1 rounded-full ${
                            profit > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {profit > 0 ? 'PROFITABLE' : 'UNPROFITABLE'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumDashboard;