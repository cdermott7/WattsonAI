import { Activity, Brain, Cpu, DollarSign, Server, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import React, { useState } from 'react';
import { formatChartData, formatCurrency, getMetricColor, useData } from '../context/DataContext';

import AnalysisPanel from './AnalysisPanel';
import MachineAllocation from './MachineAllocation';
import AnimatedNumber from './AnimatedNumber';
import { useLiquidGlass } from './SimpleLiquidGlass';

const PremiumDashboard = () => {
  const { 
    prices, 
    inventory, 
    profitability, 
    machines, 
    loading, 
    isUpdating, 
    error, 
    lastUpdated,
    updateMachinesData,
    apiKey
  } = useData();
  
  const [selectedMetric, setSelectedMetric] = useState('energy');
  const [hoveredData, setHoveredData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  // Liquid glass refs for major components
  const chartContainerRef = useLiquidGlass({ width: 800, height: 400 });
  const metricsGridRef = useLiquidGlass({ width: 600, height: 300 });
  const assetsContainerRef = useLiquidGlass({ width: 500, height: 350 });

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

  const chartData = formatChartData(prices);
  const latestPrice = prices[0] || {};
  const metricColors = getMetricColor(selectedMetric);
  
  // Clean chart data ready for display

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      setHoveredData(data);
      setShowTooltip(true);
      return null; // We'll render our custom tooltip separately
    } else {
      setShowTooltip(false);
      setHoveredData(null);
    }
    return null;
  };

  const getMetricValue = (data, metric) => {
    if (!data) {
      return 0;
    }
    
    let value;
    switch (metric) {
      case 'energy': 
        // Use 'energy' field from chart data
        value = data.energy !== undefined ? data.energy : 0;
        break;
      case 'hash': 
        // Use 'hash' field from chart data
        value = data.hash !== undefined ? data.hash : 0;
        break;
      case 'token': 
        // Use 'token' field from chart data (this maps to 'value' in the API)
        value = data.token !== undefined ? data.token : 0;
        break;
      default: 
        value = 0;
    }
    
    // Value extracted successfully
    return Number(value) || 0;
  };

  const getMetricLabel = (metric) => {
    switch (metric) {
      case 'energy': return 'Energy Price';
      case 'hash': return 'Hash Price';
      case 'token': return 'Token Price';
      default: return 'Price';
    }
  };

  const getMetricSuffix = (metric) => {
    switch (metric) {
      case 'energy': return '/kWh';
      case 'hash': return '/TH';
      case 'token': return '';
      default: return '';
    }
  };

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
              {prices.length >= 2 && (
                <div className="flex items-center justify-center mt-2 space-x-1">
                  {latestPrice.energy_price > prices[1].energy_price ? (
                    <TrendingUp className="w-3 h-3 text-red-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-green-400" />
                  )}
                  <span className={`text-xs ${
                    latestPrice.energy_price > prices[1].energy_price ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {Math.abs(((latestPrice.energy_price - prices[1].energy_price) / prices[1].energy_price) * 100).toFixed(1)}%
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
              {prices.length >= 2 && (
                <div className="flex items-center justify-center mt-2 space-x-1">
                  {latestPrice.hash_price > prices[1].hash_price ? (
                    <TrendingUp className="w-3 h-3 text-green-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-400" />
                  )}
                  <span className={`text-xs ${
                    latestPrice.hash_price > prices[1].hash_price ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {Math.abs(((latestPrice.hash_price - prices[1].hash_price) / prices[1].hash_price) * 100).toFixed(1)}%
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
              {prices.length >= 2 && (
                <div className="flex items-center justify-center mt-2 space-x-1">
                  {latestPrice.token_price > prices[1].token_price ? (
                    <TrendingUp className="w-3 h-3 text-green-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-400" />
                  )}
                  <span className={`text-xs ${
                    latestPrice.token_price > prices[1].token_price ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {Math.abs(((latestPrice.token_price - prices[1].token_price) / prices[1].token_price) * 100).toFixed(1)}%
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
                {profitability ? 
                  formatCurrency(
                    profitability.miners.reduce((sum, m) => sum + m.profit, 0) + 
                    profitability.inference.reduce((sum, i) => sum + i.profit, 0)
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

          <div className="h-80 p-4 relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                onMouseMove={(e) => {
                  if (e && e.activePayload && e.activePayload.length > 0) {
                    const payload = e.activePayload[0].payload;
                    setHoveredData(payload);
                    setShowTooltip(true);
                  }
                }}
                onMouseLeave={() => {
                  setShowTooltip(false);
                  setHoveredData(null);
                }}
              >
                <defs>
                  <linearGradient id={`gradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={metricColors.primary} stopOpacity={0.4}/>
                    <stop offset="50%" stopColor={metricColors.primary} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={metricColors.primary} stopOpacity={0}/>
                  </linearGradient>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <filter id="line-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="lineBlur"/>
                    <feMerge>
                      <feMergeNode in="lineBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <XAxis 
                  dataKey="time" 
                  stroke="rgba(255, 255, 255, 0.3)" 
                  fontSize={10}
                  fontWeight={300}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}
                  tickMargin={15}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="rgba(255, 255, 255, 0.3)" 
                  fontSize={10}
                  fontWeight={300}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}
                  tickMargin={15}
                  width={60}
                  tickFormatter={(value) => {
                    if (value < 1) return `$${value.toFixed(3)}`;
                    if (value < 100) return `$${value.toFixed(1)}`;
                    return `$${Math.round(value)}`;
                  }}
                  domain={['dataMin * 0.95', 'dataMax * 1.05']}
                />
                <Area
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={metricColors.primary}
                  strokeWidth={3}
                  fill={`url(#gradient-${selectedMetric})`}
                  dot={false}
                  activeDot={{ 
                    r: 8, 
                    stroke: metricColors.primary, 
                    strokeWidth: 4,
                    fill: 'rgba(0, 0, 0, 0.9)',
                    filter: 'url(#glow)',
                    style: { dropShadow: `0 0 10px ${metricColors.primary}` }
                  }}
                  connectNulls={true}
                  animationDuration={800}
                />
                <Tooltip content={<CustomTooltip />} />
              </AreaChart>
            </ResponsiveContainer>
            
            {/* Custom Floating Tooltip */}
            <AnimatePresence>
              {showTooltip && hoveredData && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
                >
                  <div className="bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-2xl">
                    <div className="text-center space-y-4">
                      <div className="text-white/60 text-sm font-medium">
                        {getMetricLabel(selectedMetric)}
                      </div>
                      
                      <div className="space-y-2">
                        <AnimatedNumber 
                          value={(() => {
                            if (!hoveredData) return 0;
                            if (selectedMetric === 'energy') return hoveredData.energy || hoveredData.energy_price || 0.0647;
                            if (selectedMetric === 'hash') return hoveredData.hash || hoveredData.hash_price || 8.44;
                            if (selectedMetric === 'token') return hoveredData.token || hoveredData.token_price || 2.91;
                            return 0;
                          })()}
                          prefix="$"
                          suffix={getMetricSuffix(selectedMetric)}
                          decimals={selectedMetric === 'energy' ? 4 : selectedMetric === 'token' ? 3 : 2}
                          fontSize="text-5xl"
                          color={selectedMetric === 'energy' ? 'text-yellow-400' : selectedMetric === 'hash' ? 'text-blue-400' : 'text-emerald-400'}
                          className="font-light"
                        />
                      </div>
                      
                      <div className="text-white/50 text-xs">
                        {hoveredData.time}
                      </div>
                      
                      {/* Insight based on value */}
                      <div className="text-xs text-white/70 max-w-xs text-center">
                        {/* Insights only */}
                        {selectedMetric === 'energy' && getMetricValue(hoveredData, selectedMetric) < 0.06 && (
                          <div>⚡ Low energy cost - optimal mining window</div>
                        )}
                        {selectedMetric === 'hash' && getMetricValue(hoveredData, selectedMetric) > 8 && (
                          <div>📈 High hash price - excellent profitability</div>
                        )}
                        {selectedMetric === 'token' && getMetricValue(hoveredData, selectedMetric) > 2 && (
                          <div>🧠 Strong token value - inference operations favorable</div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* AI Analysis Panel */}
        <div className="mb-12">
          <AnalysisPanel />
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
            
            {inventory && (
              <div className="space-y-4">
                {Object.entries(inventory.miners).map(([type, stats]) => {
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
            
            {inventory && (
              <div className="space-y-4">
                {Object.entries(inventory.inference).map(([type, stats]) => {
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

          {/* MARA Machines Data */}
          {machines && (
            <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
              <div className="flex items-center space-x-3 mb-6">
                <Server className="w-6 h-6 text-purple-500" />
                <h3 className="text-xl font-light text-white">MARA Machines</h3>
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Air Miners */}
                {machines.air_miners > 0 && (
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-white font-medium">Air Miners</h4>
                          <p className="text-white/60 text-sm">
                            {machines.air_miners} units • {machines.power?.air_miners || 0}W
                          </p>
                        </div>
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      
                      <div className="space-y-2 text-xs text-white/50">
                        <div className="flex justify-between">
                          <span>Power:</span>
                          <span className="text-white">{(machines.power?.air_miners || 0).toLocaleString()}W</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Revenue:</span>
                          <span className="text-white">${(machines.revenue?.air_miners || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hydro Miners */}
                {machines.hydro_miners > 0 && (
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-white font-medium">Hydro Miners</h4>
                          <p className="text-white/60 text-sm">
                            {machines.hydro_miners} units • {machines.power?.hydro_miners || 0}W
                          </p>
                        </div>
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      
                      <div className="space-y-2 text-xs text-white/50">
                        <div className="flex justify-between">
                          <span>Power:</span>
                          <span className="text-white">{(machines.power?.hydro_miners || 0).toLocaleString()}W</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Revenue:</span>
                          <span className="text-white">${(machines.revenue?.hydro_miners || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Immersion Miners */}
                {machines.immersion_miners > 0 && (
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-white font-medium">Immersion Miners</h4>
                          <p className="text-white/60 text-sm">
                            {machines.immersion_miners} units • {machines.power?.immersion_miners || 0}W
                          </p>
                        </div>
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      
                      <div className="space-y-2 text-xs text-white/50">
                        <div className="flex justify-between">
                          <span>Power:</span>
                          <span className="text-white">{(machines.power?.immersion_miners || 0).toLocaleString()}W</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Revenue:</span>
                          <span className="text-white">${(machines.revenue?.immersion_miners || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* GPU Compute */}
                {machines.gpu_compute > 0 && (
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-white font-medium">GPU Compute</h4>
                          <p className="text-white/60 text-sm">
                            {machines.gpu_compute} units • {machines.power?.gpu_compute || 0}W
                          </p>
                        </div>
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      
                      <div className="space-y-2 text-xs text-white/50">
                        <div className="flex justify-between">
                          <span>Power:</span>
                          <span className="text-white">{(machines.power?.gpu_compute || 0).toLocaleString()}W</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Revenue:</span>
                          <span className="text-white">${(machines.revenue?.gpu_compute || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ASIC Compute */}
                {machines.asic_compute > 0 && (
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-white font-medium">ASIC Compute</h4>
                          <p className="text-white/60 text-sm">
                            {machines.asic_compute} units • {machines.power?.asic_compute || 0}W
                          </p>
                        </div>
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      
                      <div className="space-y-2 text-xs text-white/50">
                        <div className="flex justify-between">
                          <span>Power:</span>
                          <span className="text-white">{(machines.power?.asic_compute || 0).toLocaleString()}W</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Revenue:</span>
                          <span className="text-white">${(machines.revenue?.asic_compute || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Summary Stats */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="text-center">
                  <div className="text-2xl font-light text-white mb-1">
                    {(machines.total_power_used || 0).toLocaleString()}
                  </div>
                  <div className="text-white/60 text-sm">Total Power (W)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-light text-white mb-1">
                    ${(machines.total_revenue || 0).toFixed(2)}
                  </div>
                  <div className="text-white/60 text-sm">Total Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-light text-white mb-1">
                    ${(machines.total_power_cost || 0).toFixed(2)}
                  </div>
                  <div className="text-white/60 text-sm">Power Cost</div>
                </div>
              </div>
              
              {!machines.air_miners && !machines.hydro_miners && !machines.immersion_miners && !machines.gpu_compute && !machines.asic_compute && (
                <div className="text-center py-8">
                  <Server className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">No machines data available</p>
                </div>
              )}
            </div>
          )}

          {machines && (
            <MachineAllocation
              apiKey={apiKey}
              initialAllocation={{
                air_miners: machines.air_miners || 0,
                hydro_miners: machines.hydro_miners || 0,
                immersion_miners: machines.immersion_miners || 0,
                gpu_compute: machines.gpu_compute || 0,
                asic_compute: machines.asic_compute || 0,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumDashboard;