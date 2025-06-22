import { Activity, AlertCircle, Brain, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { aiModules, liveEvents, performanceMetrics } from '../services/enhancedMockData';
import { formatCurrency, useData } from '../context/DataContext';

import AnimatedNumber from './AnimatedNumber';
import { EnhancedWattsonAI } from '../utils/enhancedWattsonAI';
import MarkdownRenderer from './MarkdownRenderer';
import { useLiquidGlass } from './SimpleLiquidGlass';

const PremiumHomepage = () => {
  const { prices, inventory, profitability, loading, error } = useData();
  const [aiStatus, setAiStatus] = useState({ status: 'green', message: '', confidence: 0 });
  const [notifications, setNotifications] = useState([]);
  
  // Liquid glass refs for each major component
  const heroRef = useLiquidGlass({ width: 800, height: 400 });
  const statusRef = useLiquidGlass({ width: 300, height: 200 });
  const insightsRef = useLiquidGlass({ width: 600, height: 300 });

  useEffect(() => {
    const wattson = new EnhancedWattsonAI();
    
    if (prices.length > 0 && inventory) {
      const status = wattson.analyzeMarketConditions();
      setAiStatus(status);
      
      // Use live events as notifications
      setNotifications(liveEvents.slice(0, 3).map(event => ({
        id: event.id,
        type: event.severity,
        title: event.title,
        message: event.message,
        timestamp: event.timestamp,
        confidence: event.confidence
      })));
    }
  }, [prices, inventory]);

  const generateNotifications = (prices, profitability) => {
    const notifications = [];
    
    if (prices.length >= 2) {
      const current = prices[0];
      const previous = prices[1];
      const energyChange = ((current.energy_price - previous.energy_price) / previous.energy_price) * 100;
      
      if (Math.abs(energyChange) > 15) {
        notifications.push({
          id: 1,
          type: energyChange > 0 ? 'critical' : 'opportunity',
          title: energyChange > 0 ? 'Energy Spike Alert' : 'Energy Arbitrage Window',
          message: `${Math.abs(energyChange).toFixed(1)}% ${energyChange > 0 ? 'increase' : 'decrease'} detected`,
          timestamp: new Date(),
          confidence: 94
        });
      }
    }

    if (profitability) {
      const totalProfit = [...profitability.miners, ...profitability.inference]
        .reduce((sum, asset) => sum + asset.profit, 0);
      
      if (totalProfit > 1000) {
        notifications.push({
          id: 2,
          type: 'opportunity',
          title: 'High Profit Window',
          message: `Current operations generating $${totalProfit.toFixed(0)}/hour`,
          timestamp: new Date(),
          confidence: 91
        });
      }
    }

    return notifications;
  };

  const getStatusGradient = (status) => {
    switch (status) {
      case 'green': return 'from-emerald-500 to-teal-600';
      case 'yellow': return 'from-amber-500 to-orange-600';
      case 'red': return 'from-red-500 to-rose-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center overflow-hidden">
        {/* Ambient Loading Effects */}
        <div className="fixed inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center relative z-10"
        >
          <div className="relative mb-8">
            {/* Outer Ring */}
            <div className="w-32 h-32 border-4 border-orange-500/20 rounded-full animate-spin"></div>
            {/* Middle Ring */}
            <div className="absolute inset-2 w-28 h-28 border-4 border-transparent border-t-orange-500 border-r-amber-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            {/* Inner Ring */}
            <div className="absolute inset-6 w-20 h-20 border-4 border-transparent border-t-amber-400 rounded-full animate-spin" style={{ animationDuration: '0.8s' }}></div>
            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="p-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 shadow-2xl"
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-extralight text-white tracking-tight mb-4">Wattson AI</h2>
            <div className="space-y-2">
              <motion.p 
                key={loading ? 'loading' : 'loaded'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/60 font-light"
              >
                Initializing strategic intelligence systems...
              </motion.p>
              <div className="flex justify-center space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 bg-orange-400 rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Loading Steps */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-xs text-white/40 space-y-1"
          >
            <div>✓ Neural networks activated</div>
            <div>✓ Market data streams connected</div>
            <div>✓ Fleet monitoring systems online</div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse mr-2"></div>
              Calibrating optimization algorithms...
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        {/* Hero Section - Chat-Focused */}
        <div 
          ref={heroRef}
          className="relative mb-16 rounded-3xl p-12 bg-gradient-to-r from-black/40 to-gray-900/40 backdrop-blur-xl"
        >
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center space-x-4">
              <img src="/logo.png" alt="Wattson AI Logo" className="w-24 h-24" />
              <div>
                <h1 className="text-6xl font-extralight text-white tracking-tight">Wattson AI</h1>
                <p className="text-2xl text-white/60 font-light">Your Strategic Operations Partner</p>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-white/80 font-light leading-relaxed mb-8">
                "Elementary, my dear colleague! I'm continuously monitoring your operations, analyzing market conditions, 
                and identifying optimization opportunities. Simply ask me anything about your mining operations."
              </p>
              
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-light text-white mb-2">
                    ${performanceMetrics.financial.profit_per_hour.toLocaleString()}
                  </div>
                  <div className="text-white/60">Current Yield/Hour</div>
                </div>
                
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getStatusGradient(aiStatus.status)} shadow-xl flex items-center justify-center`}>
                  <Activity className="w-6 h-6 text-white animate-pulse" />
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-light text-white mb-2">{aiStatus.confidence}%</div>
                  <div className="text-white/60">AI Confidence</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Notifications - Primary Focus */}
        <div className="mb-16">
          <h2 className="text-3xl font-light text-white mb-8 text-center">Live AI Notifications</h2>
          
          {notifications.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {notifications.map((notification) => (
                <div key={notification.id} className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${
                    notification.type === 'critical' ? 'from-red-500/30 to-rose-500/30' : 
                    notification.type === 'opportunity' ? 'from-emerald-500/30 to-teal-500/30' :
                    'from-yellow-500/30 to-amber-500/30'
                  } rounded-3xl blur opacity-75 group-hover:opacity-100 transition-opacity`}></div>
                  
                  <div className="relative bg-black/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-2xl ${
                        notification.type === 'critical' ? 'bg-red-500/20' : 
                        notification.type === 'opportunity' ? 'bg-emerald-500/20' :
                        'bg-yellow-500/20'
                      }`}>
                        <AlertCircle className={`w-8 h-8 ${
                          notification.type === 'critical' ? 'text-red-400' : 
                          notification.type === 'opportunity' ? 'text-emerald-400' :
                          'text-yellow-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-medium text-white mb-2">{notification.title}</h3>
                        <MarkdownRenderer 
                          content={notification.message} 
                          className="text-white/80 text-lg mb-4 leading-relaxed"
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-white/50 text-sm">
                            {notification.timestamp.toLocaleTimeString()}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-white/60 text-sm">Confidence:</span>
                            <span className="text-orange-400 font-mono text-lg">
                              {notification.confidence}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="w-12 h-12 text-green-400" />
              </div>
              <h3 className="text-2xl font-light text-white mb-4">All Systems Optimal</h3>
              <p className="text-white/60 text-lg font-light max-w-2xl mx-auto">
                Wattson is continuously monitoring your operations. All parameters are within optimal ranges. 
                I'll notify you immediately of any opportunities or concerns.
              </p>
            </div>
          )}
        </div>

        {/* Compact Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Energy Price Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-black/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-yellow-500/30 transition-all">
              <div className="flex items-center justify-between mb-6">
                <Zap className="w-6 h-6 text-yellow-500" />
                <div className="text-sm text-white/60 font-mono">LIVE</div>
              </div>
              <div className="space-y-2">
                <AnimatedNumber 
                  value={prices[0]?.energy_price || 0}
                  prefix="$"
                  suffix="/kWh"
                  decimals={4}
                  fontSize="text-3xl"
                  color="text-white"
                />
                <p className="text-white/60">Energy Price</p>
                {prices.length >= 2 && (
                  <div className="flex items-center space-x-2">
                    {prices[0].energy_price > prices[1].energy_price ? (
                      <TrendingUp className="w-4 h-4 text-red-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-green-400" />
                    )}
                    <span className={`text-sm ${
                      prices[0].energy_price > prices[1].energy_price ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {Math.abs(((prices[0].energy_price - prices[1].energy_price) / prices[1].energy_price) * 100).toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hash Rate Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-black/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-blue-500/30 transition-all">
              <div className="flex items-center justify-between mb-6">
                <Activity className="w-6 h-6 text-blue-500" />
                <div className="text-sm text-white/60 font-mono">MINING</div>
              </div>
              <div className="space-y-2">
                <AnimatedNumber 
                  value={prices[0]?.hash_price || 0}
                  prefix="$"
                  suffix="/TH"
                  decimals={2}
                  fontSize="text-3xl"
                  color="text-white"
                />
                <p className="text-white/60">Hash Price</p>
                {prices.length >= 2 && (
                  <div className="flex items-center space-x-2">
                    {prices[0].hash_price > prices[1].hash_price ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`text-sm ${
                      prices[0].hash_price > prices[1].hash_price ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {Math.abs(((prices[0].hash_price - prices[1].hash_price) / prices[1].hash_price) * 100).toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Token Price Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-black/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between mb-6">
                <Brain className="w-6 h-6 text-emerald-500" />
                <div className="text-sm text-white/60 font-mono">INFERENCE</div>
              </div>
              <div className="space-y-2">
                <AnimatedNumber 
                  value={prices[0]?.token_price || 0}
                  prefix="$"
                  decimals={3}
                  fontSize="text-3xl"
                  color="text-white"
                />
                <p className="text-white/60">Token Price</p>
                {prices.length >= 2 && (
                  <div className="flex items-center space-x-2">
                    {prices[0].token_price > prices[1].token_price ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`text-sm ${
                      prices[0].token_price > prices[1].token_price ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {Math.abs(((prices[0].token_price - prices[1].token_price) / prices[1].token_price) * 100).toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AI Status & Insights with Liquid Glass */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* AI Status */}
          <div 
            ref={statusRef}
            className="relative bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${getStatusGradient(aiStatus.status)} animate-pulse`}></div>
              <h3 className="text-2xl font-light text-white">System Status</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-white/80 text-lg font-light leading-relaxed">
                {aiStatus.message}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-white/60">Confidence Level</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${getStatusGradient(aiStatus.status)} transition-all duration-1000`}
                      style={{ width: `${aiStatus.confidence}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-mono">{aiStatus.confidence}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Notifications */}
          <div className="space-y-4">
            <h3 className="text-2xl font-light text-white mb-6">Critical Insights</h3>
            
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification.id} className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${
                    notification.type === 'critical' ? 'from-red-500/20 to-rose-500/20' : 'from-emerald-500/20 to-teal-500/20'
                  } rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity`}></div>
                  
                  <div className="relative bg-black/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <div className="flex items-start space-x-4">
                      <AlertCircle className={`w-6 h-6 mt-1 ${
                        notification.type === 'critical' ? 'text-red-500' : 'text-emerald-500'
                      }`} />
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-1">{notification.title}</h4>
                        <p className="text-white/70 text-sm mb-3">{notification.message}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/50">
                            {notification.timestamp.toLocaleTimeString()}
                          </span>
                          <span className="text-white/60 font-mono">
                            {notification.confidence}% confidence
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
                <p className="text-white/60 font-light">All systems operating within normal parameters</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Call-to-Action */}
        <div 
          ref={insightsRef}
          className="relative bg-gradient-to-r from-black/40 to-gray-900/40 backdrop-blur-xl rounded-3xl p-12 border border-white/10 text-center"
        >
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="p-4 rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 shadow-2xl">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-4xl font-light text-white">Start Conversation</h3>
            </div>
            
            <p className="text-2xl text-white/80 font-light leading-relaxed">
              "Ready to optimize your operations? Click the chat icon in the bottom right to begin our conversation. 
              I can help with market analysis, operational recommendations, or answer any questions about your mining infrastructure."
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h4 className="text-white font-medium mb-3">Market Analysis</h4>
                <p className="text-white/70 text-sm">
                  "Ask me about current energy prices, hash rates, or arbitrage opportunities"
                </p>
              </div>
              
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h4 className="text-white font-medium mb-3">Performance Review</h4>
                <p className="text-white/70 text-sm">
                  "Request summaries of today's operations, profit analysis, or efficiency metrics"
                </p>
              </div>
              
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h4 className="text-white font-medium mb-3">Strategic Recommendations</h4>
                <p className="text-white/70 text-sm">
                  "Get AI-powered suggestions for asset allocation and operational optimization"
                </p>
              </div>
            </div>
            
            <div className="pt-8">
              <div className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl shadow-lg">
                <Brain className="w-6 h-6 text-white animate-pulse" />
                <span className="text-white font-medium">Wattson AI is online and ready</span>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumHomepage;