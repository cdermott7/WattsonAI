import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiquidGlass } from './SimpleLiquidGlass';
import { EnhancedWattsonAI } from '../utils/enhancedWattsonAI';
import { performanceMetrics, liveEvents, marketData, fleetData } from '../services/enhancedMockData';
import AnimatedNumber from './AnimatedNumber';
import SuccessNotification from './SuccessNotification';
import MarkdownRenderer from './MarkdownRenderer';
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
  const [showLimitMenu, setShowLimitMenu] = useState(false);
  const [executionLimits, setExecutionLimits] = useState({
    autoExecuteEnabled: false,
    maxExecutionsPerHour: 5,
    maxExecutionValue: 50000,
    requireConfirmation: true
  });
  const [actionProgress, setActionProgress] = useState({});
  const [executingActions, setExecutingActions] = useState(new Set());
  const [showLimitOrders, setShowLimitOrders] = useState(false);
  const [limitOrders, setLimitOrders] = useState([]);
  const [newLimitOrder, setNewLimitOrder] = useState({
    type: 'energy-price',
    condition: 'below',
    value: 0.055,
    action: 'scale-mining',
    allocation: 80
  });
  const [successNotification, setSuccessNotification] = useState({
    show: false,
    title: '',
    message: '',
    impact: null
  });
  
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

  const handleElementaryAction = async (actionType) => {
    if (executingActions.has(actionType)) return;

    setExecutingActions(prev => new Set([...prev, actionType]));
    setActionProgress(prev => ({ ...prev, [actionType]: 0 }));

    // Simulate detailed progress with multiple steps
    const steps = getActionSteps(actionType);
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setActionProgress(prev => ({ 
        ...prev, 
        [actionType]: Math.round((i + 1) / steps.length * 100)
      }));
    }

    // Generate AI response for the action
    const response = generateActionResponse(actionType);
    const aiMessage = {
      id: Date.now(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      confidence: Math.floor(Math.random() * 15) + 85,
      actionType: actionType
    };

    setMessages(prev => [...prev, aiMessage]);
    
    // Show success notification
    const successData = getSuccessData(actionType);
    setSuccessNotification({
      show: true,
      title: successData.title,
      message: successData.message,
      impact: successData.impact
    });
    
    setExecutingActions(prev => {
      const newSet = new Set(prev);
      newSet.delete(actionType);
      return newSet;
    });
    setActionProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[actionType];
      return newProgress;
    });
  };

  const getSuccessData = (actionType) => {
    const successData = {
      'optimize-fleet': {
        title: 'Fleet Optimization Complete',
        message: 'Successfully reallocated 340 ASIC miners to optimal locations with 12% efficiency improvement.',
        impact: {
          revenue: '+$68,328/day',
          efficiency: '+18.3%'
        }
      },
      'energy-analysis': {
        title: 'Energy Analysis Complete',
        message: 'Market intelligence analysis complete. Battery arbitrage opportunity identified.',
        impact: {
          revenue: '+$4,200/hour',
          efficiency: '+12.4%'
        }
      },
      'forecast-model': {
        title: 'Forecast Model Complete',
        message: 'LSTM neural networks predict 94.2% probability of profitable conditions.',
        impact: {
          revenue: 'Optimized timing',
          efficiency: '+8.1% hash price'
        }
      },
      'profit-report': {
        title: 'Profit Analysis Complete',
        message: 'Comprehensive revenue analysis shows 68.1% EBITDA margin with 127% ROI.',
        impact: {
          revenue: '$459,100/day',
          efficiency: '68.4% margin'
        }
      }
    };
    return successData[actionType] || {
      title: 'Action Complete',
      message: 'Operation completed successfully.',
      impact: null
    };
  };

  const getActionSteps = (actionType) => {
    const steps = {
      'optimize-fleet': [
        'Analyzing current fleet allocation...',
        'Calculating energy efficiency ratios...',
        'Identifying underperforming assets...',
        'Optimizing miner distribution...',
        'Validating optimization parameters...'
      ],
      'energy-analysis': [
        'Fetching real-time energy prices...',
        'Analyzing market volatility patterns...',
        'Calculating arbitrage opportunities...',
        'Evaluating battery deployment options...',
        'Generating strategic recommendations...'
      ],
      'forecast-model': [
        'Loading LSTM neural networks...',
        'Processing historical market data...',
        'Running Monte Carlo simulations...',
        'Calculating confidence intervals...',
        'Generating forecast predictions...'
      ],
      'profit-report': [
        'Aggregating revenue streams...',
        'Calculating operational expenses...',
        'Analyzing profit margins by asset...',
        'Comparing period-over-period performance...',
        'Generating executive summary...'
      ]
    };
    return steps[actionType] || ['Processing request...'];
  };

  const handleAddLimitOrder = () => {
    const order = {
      id: Date.now(),
      ...newLimitOrder,
      created: new Date(),
      status: 'active'
    };
    setLimitOrders(prev => [...prev, order]);
    setNewLimitOrder({
      type: 'energy-price',
      condition: 'below',
      value: 0.055,
      action: 'scale-mining',
      allocation: 80
    });
    
    // Add AI message about the limit order
    const aiMessage = {
      id: Date.now() + 1,
      type: 'ai',
      content: `**Limit Order Created** 📋

Elementary! I've established a new automated execution trigger:

**Condition:** When ${newLimitOrder.type.replace('-', ' ')} goes ${newLimitOrder.condition} $${newLimitOrder.value}
**Action:** ${newLimitOrder.action.replace('-', ' ')} at ${newLimitOrder.allocation}% capacity

This strategic automation will execute seamlessly when market conditions align with our parameters. The beauty of algorithmic trading lies in its precision timing - quite remarkable, really.

Order Status: **ACTIVE** | Monitoring: **CONTINUOUS**`,
      timestamp: new Date(),
      confidence: 94
    };
    setMessages(prev => [...prev, aiMessage]);
  };

  const removeLimitOrder = (orderId) => {
    setLimitOrders(prev => prev.filter(order => order.id !== orderId));
  };

  const generateActionResponse = (actionType) => {
    const responses = {
      'optimize-fleet': `**Fleet Optimization Complete** ⚡

**Analysis Results:**
• Identified 12% efficiency improvement opportunity
• Recommended reallocation: 340 units Virginia → Oregon facility
• Projected profit increase: $2,847/hour (+18.3%)
• Temperature optimization saves 2.1°C average

**Actions Taken:**
✓ Redistributed 340 ASIC miners to optimal locations
✓ Adjusted cooling parameters for maximum efficiency  
✓ Updated mining pool allocations
✓ Enabled dynamic load balancing

**Impact:** Elementary deduction suggests $68,328 additional daily revenue. The correlation between thermal efficiency and profit optimization is quite remarkable.`,

      'energy-analysis': `**Energy Market Analysis Complete** ⚡

**Current Market Intelligence:**
• Grid prices trending +12.4% (next 4 hours)
• Peak demand window: 16:00-20:00 UTC
• Battery arbitrage opportunity: $4,200/hour potential
• Renewable energy mix: 67.8% (optimal for carbon credits)

**Strategic Recommendations:**
✓ Deploy battery storage during peak pricing
✓ Scale mining operations during off-peak hours
✓ Activate demand response programs
✓ Hedge 40% of energy exposure

**Forecast:** Energy volatility creates extraordinary profit opportunities. Battery deployment window opens in 47 minutes - quite fortuitous timing, really.`,

      'forecast-model': `**LSTM Forecasting Model Complete** 📊

**Prediction Results (Next 24H):**
• Hash Price: $8.44 → $9.12 (+8.1%) [Confidence: 89%]
• Energy Cost: $0.0647 → $0.0584 (-9.7%) [Confidence: 92%]  
• Token Value: $2.14 → $2.31 (+7.9%) [Confidence: 87%]
• Network Difficulty: +2.1% adjustment pending

**Key Insights:**
✓ Optimal mining window: 02:00-06:00 UTC (lowest energy costs)
✓ Inference operations most profitable 14:00-18:00 UTC
✓ Battery arbitrage peak: 19:00-21:00 UTC

**Strategic Forecast:** Monte Carlo analysis suggests 94.2% probability of profitable conditions. The convergence of market forces is elementary to predict with proper data analysis.`,

      'profit-report': `**Comprehensive Profit Analysis Complete** 💰

**Revenue Breakdown (Last 24H):**
• Mining Operations: $308,440 (67.2% of total)
• AI Inference: $127,680 (27.8% of total)
• Energy Arbitrage: $22,980 (5.0% of total)
• **Total Revenue:** $459,100

**Operational Metrics:**
• Gross Margin: 68.4% (+2.1% vs. previous period)
• EBITDA: $312,847 (68.1% margin)
• ROI: 127% annualized
• Power Usage Effectiveness: 1.09

**Performance Insights:** Mining fleet efficiency improved 3.2% through thermal optimization. Inference operations exceeding projections by 12.8%. Elementary application of strategic resource allocation principles.`
    };
    return responses[actionType] || 'Analysis complete. Results processed successfully.';
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
                      <MarkdownRenderer 
                        content={message.content} 
                        className="text-sm leading-relaxed"
                      />
                      {message.confidence && (
                        <div className="text-xs opacity-70 mt-2">Confidence: {message.confidence}%</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-4">
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
                    onClick={() => setShowLimitOrders(!showLimitOrders)}
                    className="px-4 py-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl transition-all backdrop-blur-sm"
                    title="Limit Orders"
                  >
                    <Target className="w-4 h-4 text-purple-400" />
                  </button>
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

                {/* Limit Orders Panel */}
                <AnimatePresence>
                  {showLimitOrders && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      <h4 className="text-white font-medium mb-3 flex items-center">
                        <Target className="w-4 h-4 mr-2 text-purple-400" />
                        Limit Orders
                      </h4>
                      
                      {/* New Limit Order Form */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <select
                          value={newLimitOrder.type}
                          onChange={(e) => setNewLimitOrder(prev => ({ ...prev, type: e.target.value }))}
                          className="bg-white/10 text-white rounded-lg px-3 py-2 text-xs border border-white/20"
                        >
                          <option value="energy-price">Energy Price</option>
                          <option value="hash-price">Hash Price</option>
                          <option value="profit-margin">Profit Margin</option>
                        </select>
                        
                        <select
                          value={newLimitOrder.condition}
                          onChange={(e) => setNewLimitOrder(prev => ({ ...prev, condition: e.target.value }))}
                          className="bg-white/10 text-white rounded-lg px-3 py-2 text-xs border border-white/20"
                        >
                          <option value="below">Below</option>
                          <option value="above">Above</option>
                        </select>
                        
                        <input
                          type="number"
                          step="0.001"
                          value={newLimitOrder.value}
                          onChange={(e) => setNewLimitOrder(prev => ({ ...prev, value: parseFloat(e.target.value) }))}
                          className="bg-white/10 text-white rounded-lg px-3 py-2 text-xs border border-white/20"
                          placeholder="Trigger value"
                        />
                        
                        <select
                          value={newLimitOrder.action}
                          onChange={(e) => setNewLimitOrder(prev => ({ ...prev, action: e.target.value }))}
                          className="bg-white/10 text-white rounded-lg px-3 py-2 text-xs border border-white/20"
                        >
                          <option value="scale-mining">Scale Mining</option>
                          <option value="deploy-batteries">Deploy Batteries</option>
                          <option value="switch-inference">Switch to Inference</option>
                          <option value="halt-operations">Halt Operations</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-white/70 text-xs">Allocation:</span>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          step="10"
                          value={newLimitOrder.allocation}
                          onChange={(e) => setNewLimitOrder(prev => ({ ...prev, allocation: parseInt(e.target.value) }))}
                          className="flex-1"
                        />
                        <span className="text-orange-400 text-xs font-mono">{newLimitOrder.allocation}%</span>
                      </div>
                      
                      <button
                        onClick={handleAddLimitOrder}
                        className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-xs transition-all"
                      >
                        Create Limit Order
                      </button>
                      
                      {/* Active Limit Orders */}
                      {limitOrders.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <div className="text-white/70 text-xs">Active Orders:</div>
                          {limitOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                              <div className="text-xs text-white">
                                {order.type.replace('-', ' ')} {order.condition} ${order.value} → {order.action.replace('-', ' ')} ({order.allocation}%)
                              </div>
                              <button
                                onClick={() => removeLimitOrder(order.id)}
                                className="text-red-400 hover:text-red-300 text-xs"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-light text-white">Elementary Actions</h3>
                <button
                  onClick={() => setShowLimitMenu(!showLimitMenu)}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
              
              {showLimitMenu && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10"
                >
                  <h4 className="text-white text-sm font-medium mb-3">Execution Limits</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-xs">Auto-Execute</span>
                      <button
                        onClick={() => setExecutionLimits(prev => ({ ...prev, autoExecuteEnabled: !prev.autoExecuteEnabled }))}
                        className={`relative w-8 h-4 rounded-full transition-colors ${
                          executionLimits.autoExecuteEnabled ? 'bg-orange-500' : 'bg-white/20'
                        }`}
                      >
                        <div className={`absolute w-3 h-3 bg-white rounded-full transition-transform top-0.5 ${
                          executionLimits.autoExecuteEnabled ? 'translate-x-4' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                    <div>
                      <label className="text-white/70 text-xs">Max Executions/Hour: {executionLimits.maxExecutionsPerHour}</label>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={executionLimits.maxExecutionsPerHour}
                        onChange={(e) => setExecutionLimits(prev => ({ ...prev, maxExecutionsPerHour: parseInt(e.target.value) }))}
                        className="w-full mt-1"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleElementaryAction('optimize-fleet')}
                  disabled={executingActions.has('optimize-fleet')}
                  className="relative p-3 bg-orange-600/20 hover:bg-orange-600/30 disabled:opacity-50 rounded-xl border border-orange-500/30 transition-all group overflow-hidden"
                >
                  {executingActions.has('optimize-fleet') ? (
                    <>
                      <div className="absolute inset-0 bg-orange-500/20">
                        <div 
                          className="h-full bg-orange-500/40 transition-all duration-300"
                          style={{ width: `${actionProgress['optimize-fleet'] || 0}%` }}
                        />
                      </div>
                      <div className="relative">
                        <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <div className="text-xs text-white">{actionProgress['optimize-fleet'] || 0}%</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Target className="w-5 h-5 text-orange-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-xs text-white">Optimize Fleet</div>
                    </>
                  )}
                </button>
                
                <button 
                  onClick={() => handleElementaryAction('energy-analysis')}
                  disabled={executingActions.has('energy-analysis')}
                  className="relative p-3 bg-blue-600/20 hover:bg-blue-600/30 disabled:opacity-50 rounded-xl border border-blue-500/30 transition-all group overflow-hidden"
                >
                  {executingActions.has('energy-analysis') ? (
                    <>
                      <div className="absolute inset-0 bg-blue-500/20">
                        <div 
                          className="h-full bg-blue-500/40 transition-all duration-300"
                          style={{ width: `${actionProgress['energy-analysis'] || 0}%` }}
                        />
                      </div>
                      <div className="relative">
                        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <div className="text-xs text-white">{actionProgress['energy-analysis'] || 0}%</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-xs text-white">Energy Analysis</div>
                    </>
                  )}
                </button>
                
                <button 
                  onClick={() => handleElementaryAction('forecast-model')}
                  disabled={executingActions.has('forecast-model')}
                  className="relative p-3 bg-emerald-600/20 hover:bg-emerald-600/30 disabled:opacity-50 rounded-xl border border-emerald-500/30 transition-all group overflow-hidden"
                >
                  {executingActions.has('forecast-model') ? (
                    <>
                      <div className="absolute inset-0 bg-emerald-500/20">
                        <div 
                          className="h-full bg-emerald-500/40 transition-all duration-300"
                          style={{ width: `${actionProgress['forecast-model'] || 0}%` }}
                        />
                      </div>
                      <div className="relative">
                        <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <div className="text-xs text-white">{actionProgress['forecast-model'] || 0}%</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-5 h-5 text-emerald-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-xs text-white">Forecast Model</div>
                    </>
                  )}
                </button>
                
                <button 
                  onClick={() => handleElementaryAction('profit-report')}
                  disabled={executingActions.has('profit-report')}
                  className="relative p-3 bg-purple-600/20 hover:bg-purple-600/30 disabled:opacity-50 rounded-xl border border-purple-500/30 transition-all group overflow-hidden"
                >
                  {executingActions.has('profit-report') ? (
                    <>
                      <div className="absolute inset-0 bg-purple-500/20">
                        <div 
                          className="h-full bg-purple-500/40 transition-all duration-300"
                          style={{ width: `${actionProgress['profit-report'] || 0}%` }}
                        />
                      </div>
                      <div className="relative">
                        <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <div className="text-xs text-white">{actionProgress['profit-report'] || 0}%</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Gauge className="w-5 h-5 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-xs text-white">Profit Report</div>
                    </>
                  )}
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

      {/* Success Notification */}
      <SuccessNotification
        show={successNotification.show}
        title={successNotification.title}
        message={successNotification.message}
        impact={successNotification.impact}
        onClose={() => setSuccessNotification(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default CommandCenter;