import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiquidGlass } from './SimpleLiquidGlass';
import { EnhancedWattsonAI } from '../utils/enhancedWattsonAI';
import { performanceMetrics, liveEvents, marketData, fleetData } from '../services/enhancedMockData';
import AnimatedNumber from './AnimatedNumber';
import { 
  Brain, 
  Activity, 
  Zap, 
  Cpu, 
  Battery, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Settings,
  Send,
  Mic,
  MicOff,
  Bell,
  Target,
  BarChart3,
  Gauge
} from 'lucide-react';

const CommandCenter = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Elementary, my dear colleague! Command Center operational. I'm monitoring 16,000 TH/s of mining capacity and 50,000 tokens/hour inference operations. What shall we optimize today?",
      timestamp: new Date(),
      confidence: 95
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [notifications, setNotifications] = useState(liveEvents.slice(0, 2));
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  
  const wattson = new EnhancedWattsonAI();
  
  // Liquid glass containers
  const heroRef = useLiquidGlass({ width: 1200, height: 300 });
  const chatRef = useLiquidGlass({ width: 800, height: 400 });
  const metricsRef = useLiquidGlass({ width: 600, height: 200 });
  const fleetRef = useLiquidGlass({ width: 500, height: 300 });

  // Simulated real-time data updates
  const [liveMetrics, setLiveMetrics] = useState({
    energyPrice: 0.0647,
    hashPrice: 8.44,
    profitPerWatt: 0.0341,
    efficiency: 95.7,
    totalHashrate: 16000,
    tokenGeneration: 50000,
    powerUtilization: 45.2,
    carbonEfficiency: 4.7
  });

  useEffect(() => {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        ...prev,
        energyPrice: prev.energyPrice + (Math.random() - 0.5) * 0.005,
        hashPrice: prev.hashPrice + (Math.random() - 0.5) * 0.3,
        profitPerWatt: prev.profitPerWatt + (Math.random() - 0.5) * 0.002,
        efficiency: Math.max(90, Math.min(99, prev.efficiency + (Math.random() - 0.5) * 0.5)),
        powerUtilization: Math.max(40, Math.min(50, prev.powerUtilization + (Math.random() - 0.5) * 1)),
        carbonEfficiency: Math.max(3, Math.min(6, prev.carbonEfficiency + (Math.random() - 0.5) * 0.2))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    setTimeout(() => {
      const aiResponse = wattson.processAdvancedQuery(inputText);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        confidence: Math.floor(Math.random() * 20) + 80
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInputText('');
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setShowNotificationModal(true);
  };

  const getStatusColor = (value, thresholds) => {
    if (value >= thresholds.good) return 'text-green-400';
    if (value >= thresholds.warning) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusGradient = (value, thresholds) => {
    if (value >= thresholds.good) return 'from-green-500 to-emerald-600';
    if (value >= thresholds.warning) return 'from-yellow-500 to-amber-600';
    return 'from-red-500 to-rose-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Ambient Effects */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        {/* Command Center Header */}
        <motion.div 
          ref={heroRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-12 rounded-3xl p-12 bg-gradient-to-r from-black/40 to-gray-900/40 backdrop-blur-xl border border-white/10"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-4 rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 shadow-2xl">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-extralight text-white tracking-tight">Command Center</h1>
                  <p className="text-xl text-white/60 font-light">Autonomous Operations Control</p>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-8">
                <div className="text-center">
                  <AnimatedNumber 
                    value={liveMetrics.energyPrice} 
                    prefix="$" 
                    suffix="/kWh" 
                    decimals={4}
                    fontSize="text-2xl"
                    color="text-yellow-400"
                  />
                  <div className="text-white/60 text-sm">Energy Price</div>
                </div>
                <div className="text-center">
                  <AnimatedNumber 
                    value={liveMetrics.hashPrice} 
                    prefix="$" 
                    suffix="/TH" 
                    decimals={2}
                    fontSize="text-2xl"
                    color="text-blue-400"
                  />
                  <div className="text-white/60 text-sm">Hash Price</div>
                </div>
                <div className="text-center">
                  <AnimatedNumber 
                    value={liveMetrics.profitPerWatt} 
                    prefix="$" 
                    suffix="/W" 
                    decimals={4}
                    fontSize="text-2xl"
                    color="text-green-400"
                  />
                  <div className="text-white/60 text-sm">Profit/Watt</div>
                </div>
                <div className="text-center">
                  <AnimatedNumber 
                    value={liveMetrics.efficiency} 
                    suffix="%" 
                    decimals={1}
                    fontSize="text-2xl"
                    color={getStatusColor(liveMetrics.efficiency, { good: 95, warning: 90 })}
                  />
                  <div className="text-white/60 text-sm">Efficiency</div>
                </div>
              </div>
            </div>

            {/* Live Status Orb */}
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-24 h-24 rounded-full bg-gradient-to-r ${getStatusGradient(liveMetrics.efficiency, { good: 95, warning: 90 })} shadow-2xl flex items-center justify-center`}
              >
                <Activity className="w-8 h-8 text-white" />
              </motion.div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-black animate-pulse"></div>
            </div>
          </div>
        </motion.div>

        {/* Main Command Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Wattson Chat Interface */}
          <div className="lg:col-span-2">
            <motion.div 
              ref={chatRef}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10 h-96"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Brain className="w-6 h-6 text-orange-400" />
                <h3 className="text-xl font-light text-white">Wattson Command Interface</h3>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>

              <div className="h-64 overflow-y-auto mb-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white'
                        : 'bg-white/10 backdrop-blur-sm text-gray-100 border border-white/20'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      {message.confidence && (
                        <div className="text-xs opacity-70 mt-2">Confidence: {message.confidence}%</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Command Wattson: 'Optimize fleet allocation' or 'Analyze energy forecast'"
                  className="flex-1 bg-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 backdrop-blur-sm border border-white/20 placeholder-white/50"
                />
                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`px-4 py-3 rounded-xl transition-all backdrop-blur-sm ${
                    isListening 
                      ? 'bg-red-600/80 hover:bg-red-600 border-red-500/50' 
                      : 'bg-white/10 hover:bg-white/20 border-white/20'
                  } border`}
                >
                  {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-white" />}
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="px-4 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all backdrop-blur-sm"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Critical Notifications */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-light text-white">Critical Alerts</h3>
                <Bell className="w-5 h-5 text-orange-400" />
              </div>
              
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleNotificationClick(notification)}
                    className="p-4 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className={`w-5 h-5 mt-1 ${
                        notification.severity === 'critical' ? 'text-red-400' : 
                        notification.severity === 'warning' ? 'text-yellow-400' : 'text-emerald-400'
                      }`} />
                      <div className="flex-1">
                        <h4 className="text-white text-sm font-medium">{notification.title}</h4>
                        <p className="text-white/70 text-xs mt-1">{notification.message.substring(0, 60)}...</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-white/50">
                            {Math.floor((Date.now() - new Date(notification.timestamp)) / 60000)}m ago
                          </span>
                          <span className="text-xs text-orange-400 font-mono">
                            {notification.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Elementary Actions */}
            <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
              <h3 className="text-lg font-light text-white mb-4">Elementary Actions</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 bg-orange-600/20 hover:bg-orange-600/30 rounded-xl border border-orange-500/30 transition-all group">
                  <Target className="w-5 h-5 text-orange-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-xs text-white">Optimize Fleet</div>
                </button>
                
                <button className="p-3 bg-blue-600/20 hover:bg-blue-600/30 rounded-xl border border-blue-500/30 transition-all group">
                  <Zap className="w-5 h-5 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-xs text-white">Energy Analysis</div>
                </button>
                
                <button className="p-3 bg-emerald-600/20 hover:bg-emerald-600/30 rounded-xl border border-emerald-500/30 transition-all group">
                  <BarChart3 className="w-5 h-5 text-emerald-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-xs text-white">Forecast Model</div>
                </button>
                
                <button className="p-3 bg-purple-600/20 hover:bg-purple-600/30 rounded-xl border border-purple-500/30 transition-all group">
                  <Gauge className="w-5 h-5 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-xs text-white">Profit Report</div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Fleet Overview */}
        <motion.div 
          ref={fleetRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
        >
          <h3 className="text-2xl font-light text-white mb-8">Fleet Overview - Real-time Operations Status</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* ASIC Miners */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <Cpu className="w-8 h-8 text-blue-400" />
                  <div className="text-xs text-white/60 font-mono">MINING</div>
                </div>
                <div className="space-y-2">
                  <AnimatedNumber 
                    value={liveMetrics.totalHashrate} 
                    suffix=" TH/s" 
                    decimals={0}
                    fontSize="text-xl"
                    color="text-white"
                  />
                  <div className="text-white/60 text-sm">ASIC Miners</div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${liveMetrics.efficiency}%` }}></div>
                  </div>
                  <div className="text-xs text-white/50">99.4% Uptime</div>
                </div>
              </div>
            </div>

            {/* GPU Units */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <Brain className="w-8 h-8 text-emerald-400" />
                  <div className="text-xs text-white/60 font-mono">INFERENCE</div>
                </div>
                <div className="space-y-2">
                  <AnimatedNumber 
                    value={liveMetrics.tokenGeneration} 
                    suffix="k/hr" 
                    decimals={0}
                    fontSize="text-xl"
                    color="text-white"
                  />
                  <div className="text-white/60 text-sm">GPU Units</div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                  <div className="text-xs text-white/50">87% Utilization</div>
                </div>
              </div>
            </div>

            {/* Power Utilization */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <Zap className="w-8 h-8 text-yellow-400" />
                  <div className="text-xs text-white/60 font-mono">POWER</div>
                </div>
                <div className="space-y-2">
                  <AnimatedNumber 
                    value={liveMetrics.powerUtilization} 
                    suffix=" MW" 
                    decimals={1}
                    fontSize="text-xl"
                    color="text-white"
                  />
                  <div className="text-white/60 text-sm">Power Utilization</div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <div className="text-xs text-white/50">PUE: 1.09</div>
                </div>
              </div>
            </div>

            {/* Carbon Efficiency */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <Activity className="w-8 h-8 text-green-400" />
                  <div className="text-xs text-white/60 font-mono">CARBON</div>
                </div>
                <div className="space-y-2">
                  <AnimatedNumber 
                    value={liveMetrics.carbonEfficiency} 
                    suffix=" tCO2e" 
                    decimals={1}
                    fontSize="text-xl"
                    color="text-white"
                  />
                  <div className="text-white/60 text-sm">Carbon Efficiency</div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                  <div className="text-xs text-white/50">67.8% Renewable</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Notification Modal */}
      <AnimatePresence>
        {showNotificationModal && selectedNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNotificationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-3xl p-8 border border-white/20 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className={`w-6 h-6 ${
                  selectedNotification.severity === 'critical' ? 'text-red-400' : 
                  selectedNotification.severity === 'warning' ? 'text-yellow-400' : 'text-emerald-400'
                }`} />
                <h3 className="text-lg font-medium text-white">{selectedNotification.title}</h3>
              </div>
              
              <p className="text-white/80 mb-6">{selectedNotification.message}</p>
              
              <div className="flex items-center justify-between mb-6">
                <span className="text-white/60 text-sm">Confidence: {selectedNotification.confidence}%</span>
                <span className="text-white/60 text-sm">{new Date(selectedNotification.timestamp).toLocaleString()}</span>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowNotificationModal(false)}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
                >
                  Dismiss
                </button>
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl transition-all">
                  Execute Recommendation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommandCenter;