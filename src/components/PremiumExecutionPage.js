import {
  Activity,
  AlertTriangle,
  Battery,
  Brain,
  CheckCircle,
  Clock,
  Cpu,
  Loader2,
  Pause,
  Play,
  Target,
  TrendingDown,
  TrendingUp,
  TrendingUp as TrendingUpIcon,
  Zap
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { aiRecommendations, simulationScenarios } from '../services/enhancedMockData';
import { calculateProfitability, fetchInventory, fetchPrices } from '../services/api';

import { EnhancedWattsonAI } from '../utils/enhancedWattsonAI';
import SuccessNotification from './SuccessNotification';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { useLiquidGlass } from './SimpleLiquidGlass';

const PremiumExecutionPage = () => {
  const { 
    analysis, 
    isAnalyzing, 
    analysisError, 
    performAnalysis,
    updateMachinesData,
    apiKey,
    machines
  } = useData();
  
  const [data, setData] = useState({ prices: [], inventory: null, profitability: null });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [simulationMode, setSimulationMode] = useState(false);
  const [executingActions, setExecutingActions] = useState(new Set());
  const [actionProgress, setActionProgress] = useState({});
  const [executionDetails, setExecutionDetails] = useState({});
  const [successNotification, setSuccessNotification] = useState({
    show: false,
    title: '',
    message: '',
    impact: null,
    details: null
  });
  
  // Liquid glass refs for major sections
  const heroRef = useLiquidGlass({ width: 800, height: 300 });
  const recommendationsRef = useLiquidGlass({ width: 700, height: 400 });
  const actionsRef = useLiquidGlass({ width: 600, height: 200 });

  useEffect(() => {
    const wattson = new EnhancedWattsonAI();
    
    const loadData = async () => {
      try {
        const [prices, inventory] = await Promise.all([
          fetchPrices(),
          fetchInventory()
        ]);
        
        const profitability = calculateProfitability(inventory, prices);
        const enhancedRecommendations = wattson.generateAdvancedRecommendations();
        
        setData({ prices, inventory, profitability });
        setRecommendations(enhancedRecommendations);
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

  const handleSimulateAction = async (actionId, action) => {
    setExecutingActions(prev => new Set([...prev, actionId]));
    setActionProgress(prev => ({ ...prev, [actionId]: 0 }));
    
    const steps = getSimulationSteps(action);
    
    for (let i = 0; i < steps.length; i++) {
      setExecutionDetails(prev => ({ ...prev, [actionId]: steps[i] }));
      await new Promise(resolve => setTimeout(resolve, 600));
      setActionProgress(prev => ({ 
        ...prev, 
        [actionId]: Math.round((i + 1) / steps.length * 100)
      }));
    }

    setExecutionDetails(prev => ({ ...prev, [actionId]: 'Simulation complete - Results validated' }));
    
    // Show success notification for simulation
    setSuccessNotification({
      show: true,
      title: 'Simulation Complete',
      message: `Successfully simulated ${action.title} with comprehensive risk analysis and outcome modeling.`,
      impact: {
        revenue: 'Risk assessment complete',
        efficiency: 'Safe execution validated'
      }
    });
    
    setTimeout(() => {
      setExecutingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionId);
        return newSet;
      });
      setActionProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[actionId];
        return newProgress;
      });
      setExecutionDetails(prev => {
        const newDetails = { ...prev };
        delete newDetails[actionId];
        return newDetails;
      });
    }, 1500);
  };

  const handleExecuteAction = async (actionId, action) => {
    setExecutingActions(prev => new Set([...prev, actionId]));
    setActionProgress(prev => ({ ...prev, [actionId]: 0 }));
    
    const steps = getExecutionSteps(action);
    
    for (let i = 0; i < steps.length; i++) {
      setExecutionDetails(prev => ({ ...prev, [actionId]: steps[i] }));
      await new Promise(resolve => setTimeout(resolve, 800));
      setActionProgress(prev => ({ 
        ...prev, 
        [actionId]: Math.round((i + 1) / steps.length * 100)
      }));
    }

    setExecutionDetails(prev => ({ ...prev, [actionId]: 'Execution complete - Systems updated' }));
    
    // Show success notification for execution
    const executionSuccess = getExecutionSuccessData(action);
    setSuccessNotification({
      show: true,
      title: executionSuccess.title,
      message: executionSuccess.message,
      impact: executionSuccess.impact
    });
    
    setTimeout(() => {
      setExecutingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionId);
        return newSet;
      });
      setActionProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[actionId];
        return newProgress;
      });
      setExecutionDetails(prev => {
        const newDetails = { ...prev };
        delete newDetails[actionId];
        return newDetails;
      });
    }, 2000);
  };

  const getSimulationSteps = (action) => {
    const steps = [
      'Initializing simulation environment...',
      'Loading historical data models...',
      'Running Monte Carlo analysis...',
      'Calculating risk parameters...',
      'Validating safety constraints...',
      'Generating outcome predictions...'
    ];
    return steps;
  };

  const getExecutionSteps = (action) => {
    const steps = [
      'Authenticating execution permissions...',
      'Validating operational parameters...',
      'Initiating system changes...',
      'Monitoring fleet responses...',
      'Verifying performance metrics...',
      'Confirming successful deployment...'
    ];
    return steps;
  };

  const getExecutionSuccessData = (action) => {
    const successTemplates = [
      {
        title: 'Strategy Successfully Executed',
        message: `${action.title} has been implemented across the mining fleet. All systems operating at optimal parameters.`,
        impact: {
          revenue: `+$${(Math.random() * 50000 + 10000).toFixed(0)}/day`,
          efficiency: `+${(Math.random() * 15 + 5).toFixed(1)}%`
        }
      },
      {
        title: 'Recommendation Deployed',
        message: `Wattson's strategic recommendation "${action.title}" is now active. Monitoring performance improvements.`,
        impact: {
          revenue: `${(Math.random() * 30 + 10).toFixed(1)}% profit increase`,
          efficiency: `${(Math.random() * 20 + 80).toFixed(1)}% system efficiency`
        }
      },
      {
        title: 'Optimization Complete',
        message: `Successfully deployed "${action.title}" optimization. Fleet operations enhanced and profit margins improved.`,
        impact: {
          revenue: `$${(Math.random() * 8000 + 2000).toFixed(0)}/hour boost`,
          efficiency: `${(Math.random() * 10 + 85).toFixed(1)}% operational score`
        }
      }
    ];
    
    return successTemplates[Math.floor(Math.random() * successTemplates.length)];
  };

  const handleEmergencyAction = (actionType) => {
    const emergencyActions = {
      'emergency-stop': {
        title: 'Emergency Stop Activated',
        message: 'All mining and inference operations have been safely halted. Systems in standby mode.',
        impact: {
          revenue: 'Operations paused',
          efficiency: 'Safety protocols active'
        }
      },
      'deploy-batteries': {
        title: 'Battery Deployment Activated',
        message: 'Energy storage systems deployed. Grid arbitrage mode activated for optimal profit capture.',
        impact: {
          revenue: '+$4,200/hour potential',
          efficiency: 'Grid optimization active'
        }
      },
      'scale-mining': {
        title: 'Mining Operations Scaled',
        message: 'Hash operations increased to maximum capacity. All miners operating at peak efficiency.',
        impact: {
          revenue: '+25% hash production',
          efficiency: '98.7% fleet utilization'
        }
      },
      'switch-inference': {
        title: 'Inference Mode Activated',
        message: 'GPU resources reallocated to AI inference operations. Token generation at maximum capacity.',
        impact: {
          revenue: '+40% inference revenue',
          efficiency: '95% GPU utilization'
        }
      }
    };

    const actionData = emergencyActions[actionType];
    setSuccessNotification({
      show: true,
      title: actionData.title,
      message: actionData.message,
      impact: actionData.impact
    });
  };

  const getActionIcon = (recommendation) => {
    if (!recommendation || !recommendation.title) {
      return <Activity className="w-6 h-6 text-gray-400" />;
    }
    
    const actionLower = recommendation.title.toLowerCase();
    if (actionLower.includes('battery') || actionLower.includes('storage')) {
      return <Battery className="w-6 h-6 text-yellow-400" />;
    }
    if (actionLower.includes('mining') || actionLower.includes('hash')) {
      return <Cpu className="w-6 h-6 text-blue-400" />;
    }
    if (actionLower.includes('inference') || actionLower.includes('gpu')) {
      return <Brain className="w-6 h-6 text-emerald-400" />;
    }
    if (actionLower.includes('geo') || actionLower.includes('routing')) {
      return <TrendingUp className="w-6 h-6 text-green-400" />;
    }
    return <Target className="w-6 h-6 text-orange-400" />;
  };

  const getPriorityGradient = (priority) => {
    switch (priority) {
      case 'high': return 'from-red-500/30 to-rose-500/30';
      case 'medium': return 'from-yellow-500/30 to-amber-500/30';
      case 'low': return 'from-green-500/30 to-emerald-500/30';
      default: return 'from-gray-500/30 to-gray-600/30';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value < 1 ? 4 : 2,
      maximumFractionDigits: value < 1 ? 4 : 2
    }).format(value);
  };

  // Analysis helper functions
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'green':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'yellow':
        return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      case 'red':
        return 'from-red-500/20 to-rose-500/20 border-red-500/30';
      default:
        return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  const getStatusBorderColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'green':
        return 'border-green-500/50 shadow-green-500/20';
      case 'yellow':
        return 'border-yellow-500/50 shadow-yellow-500/20';
      case 'red':
        return 'border-red-500/50 shadow-red-500/20';
      default:
        return 'border-gray-500/50 shadow-gray-500/20';
    }
  };

  const handleExecuteAnalysisAction = async (action) => {
    if (action.type === 'api_call' && action.body) {
      try {
        // Show success notification immediately, without details
        setSuccessNotification({
          show: true,
          title: 'Allocation Updated',
          message: 'Machine allocation has been successfully updated based on AI analysis.',
          impact: {
            revenue: action.profit_impact,
            efficiency: '+12.3%' // This can be part of a future enhancement
          },
          details: null // Details will be loaded in the background
        });

        // Update machines and fetch details in parallel
        await updateMachinesData(action.body);
        
        // After successful execution, get the detailed analysis
        const summaryResponse = await axios.post('http://localhost:3001/api/execution-summary', {
          action,
          globalContext: {
            prices: data.prices,
            inventory: data.inventory,
            machines: machines,
          },
          apiKey: apiKey
        });
      
        const detailedAnalysis = summaryResponse.data.data;

        // Update the notification with the details
        setSuccessNotification(prev => ({
            ...prev,
            details: detailedAnalysis
        }));

      } catch (error) {
        console.error('Error executing analysis action:', error);
        // Optionally, update the notification to show an error
        setSuccessNotification(prev => ({
            ...prev,
            title: 'Update Failed',
            message: 'There was an error updating the machine allocation.',
            details: { error: 'Could not retrieve execution analysis.' }
        }));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center overflow-hidden">
        {/* Ambient Effects */}
        <div className="fixed inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
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
            <div className="absolute inset-2 w-28 h-28 border-4 border-transparent border-t-orange-500 border-r-emerald-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            {/* Inner Ring */}
            <div className="absolute inset-6 w-20 h-20 border-4 border-transparent border-t-emerald-400 rounded-full animate-spin" style={{ animationDuration: '0.8s' }}></div>
            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="p-4 rounded-full bg-gradient-to-r from-orange-500 to-emerald-500 shadow-2xl"
              >
                <Target className="w-8 h-8 text-white" />
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-extralight text-white tracking-tight mb-4">Execution Center</h2>
            <div className="space-y-2">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/60 font-light"
              >
                Analyzing strategic execution opportunities...
              </motion.p>
              <div className="flex justify-center space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 bg-emerald-400 rounded-full"
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
            <div>✓ Strategic analysis modules loaded</div>
            <div>✓ Market intelligence connected</div>
            <div>✓ Risk assessment algorithms active</div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-2"></div>
              Generating execution recommendations...
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        {/* Hero Header */}
        <div 
          ref={heroRef}
          className={`relative mb-16 rounded-3xl p-12 bg-gradient-to-r from-black/40 to-gray-900/40 backdrop-blur-xl border ${getStatusBorderColor(analysis?.status)}`}
        >
          {/* Status LED Border */}
          {analysis?.status && (
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
              analysis.status.toLowerCase() === 'green' ? 'from-green-400 to-emerald-400' :
              analysis.status.toLowerCase() === 'yellow' ? 'from-yellow-400 to-amber-400' :
              analysis.status.toLowerCase() === 'red' ? 'from-red-400 to-rose-400' :
              'from-gray-400 to-gray-500'
            } rounded-t-3xl animate-pulse shadow-lg`}></div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-extralight text-white tracking-tight">Execution Center</h1>
                  <p className="text-xl text-white/60 font-light">AI-Powered Strategic Operations</p>
                  {analysis?.status && (
                    <div className="flex items-center space-x-2 mt-2">
                      <div className={`w-3 h-3 rounded-full ${
                        analysis.status.toLowerCase() === 'green' ? 'bg-green-400' :
                        analysis.status.toLowerCase() === 'yellow' ? 'bg-yellow-400' :
                        analysis.status.toLowerCase() === 'red' ? 'bg-red-400' :
                        'bg-gray-400'
                      } animate-pulse`}></div>
                      <span className={`text-sm font-medium ${
                        analysis.status.toLowerCase() === 'green' ? 'text-green-400' :
                        analysis.status.toLowerCase() === 'yellow' ? 'text-yellow-400' :
                        analysis.status.toLowerCase() === 'red' ? 'text-red-400' :
                        'text-gray-400'
                      }`}>
                        {analysis.status.toUpperCase()} STATUS
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-2xl font-light text-white mb-1">
                    {formatCurrency(data.prices[0]?.energy_price || 0)}
                  </div>
                  <div className="text-white/60 text-sm">Energy Cost</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-light text-white mb-1">
                    {formatCurrency(data.prices[0]?.hash_price || 0)}
                  </div>
                  <div className="text-white/60 text-sm">Hash Value</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-light text-white mb-1">
                    {data.profitability ? 
                      formatCurrency(
                        data.profitability.miners.reduce((sum, m) => sum + m.profit, 0) + 
                        data.profitability.inference.reduce((sum, i) => sum + i.profit, 0)
                      ) : 
                      '$0.00'
                    }
                  </div>
                  <div className="text-white/60 text-sm">Total Yield</div>
                </div>
              </div>
            </div>

            {/* Analysis Control */}
            <div className="text-center space-y-4">
              <motion.button
                onClick={performAnalysis}
                disabled={isAnalyzing}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all backdrop-blur-sm shadow-lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" />
                    <span>Run Analysis</span>
                  </>
                )}
              </motion.button>
              
              <button
                onClick={() => setSimulationMode(!simulationMode)}
                className={`relative px-8 py-4 rounded-2xl transition-all duration-300 ${
                  simulationMode 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' 
                    : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5" />
                  <span className="font-medium">
                    {simulationMode ? 'Simulation Mode' : 'Live Mode'}
                  </span>
                </div>
                {simulationMode && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                )}
              </button>
              <p className="text-white/50 text-xs">
                {simulationMode ? 'Safe testing environment' : 'Real operations control'}
              </p>
            </div>
          </div>
        </div>

        {/* Analysis Summary */}
        {analysis && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-12 p-8 rounded-3xl border bg-gradient-to-r ${getStatusColor(analysis.status)}`}
          >
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              <h3 className="text-2xl font-light text-white">Market Analysis Summary</h3>
            </div>
            <p className="text-white/80 leading-relaxed text-lg">
              {analysis.summary || 'No analysis summary available'}
            </p>
          </motion.div>
        )}

        {/* Analysis Loading State */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-8 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10"
          >
            <div className="text-center py-8">
              <div className="relative mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-transparent border-t-purple-500 border-r-pink-500 rounded-full mx-auto"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <h4 className="text-white font-medium mb-2">Wattson AI is analyzing...</h4>
              <p className="text-white/60 text-sm">Processing market data and generating recommendations</p>
            </div>
          </motion.div>
        )}

        {/* Analysis Error State */}
        {analysisError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-8 bg-red-500/10 rounded-3xl border border-red-500/20"
          >
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <div>
                <h4 className="text-red-400 font-medium">Analysis Error</h4>
                <p className="text-red-400/80 text-sm">{analysisError}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* AI Recommendations */}
        <div 
          ref={recommendationsRef}
          className="mb-12 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10"
        >
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Brain className="w-8 h-8 text-orange-400" />
                <div>
                  <h2 className="text-3xl font-light text-white">Strategic Recommendations</h2>
                  <p className="text-white/60 text-sm mt-1">AI-powered optimization strategies</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/40 text-xs">Last Updated</div>
                <div className="text-white text-sm">{new Date().toLocaleTimeString()}</div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Analysis Actions */}
            {analysis?.actions && analysis.actions.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center space-x-3 mb-6">
                  <Zap className="w-6 h-6 text-orange-400" />
                  <h3 className="text-xl font-medium text-white">AI-Generated Allocation Updates</h3>
                </div>
                
                {analysis.actions.map((action, index) => (
                  <motion.div
                    key={`analysis-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative mb-6"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                      {/* Header Section */}
                      <div className="p-6 border-b border-white/5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20">
                              <Cpu className="w-6 h-6 text-orange-400" />
                            </div>
                            <div>
                              <h3 className="text-xl font-medium text-white mb-1">Update Machine Allocation</h3>
                              <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30">
                                AI RECOMMENDED
                              </span>
                            </div>
                          </div>
                          
                          {/* Execute Button */}
                          <button
                            onClick={() => handleExecuteAnalysisAction(action)}
                            className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-sm rounded-xl transition-all backdrop-blur-sm shadow-lg"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Execute Update
                          </button>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6 space-y-6">
                        <p className="text-white/80 text-base leading-relaxed">
                          {action.description || 'AI-recommended machine allocation optimization'}
                        </p>
                        
                        {/* Enhanced Metrics Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="text-white/60 text-xs mb-1">Confidence</div>
                            <div className="font-mono text-lg text-green-400">
                              {action.confidence || '94.2%'}
                            </div>
                          </div>
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="text-white/60 text-xs mb-1">Timeframe</div>
                            <div className="text-white text-lg font-medium">
                              {action.timeframe || '4 hours'}
                            </div>
                          </div>
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="text-white/60 text-xs mb-1">Profit Impact</div>
                            <div className="text-green-400 font-medium text-lg">
                              {action.profit_impact || '+$3,247/hour'}
                            </div>
                          </div>
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="text-white/60 text-xs mb-1">Carbon Impact</div>
                            <div className="text-emerald-400 font-medium text-lg">
                              {action.carbon_impact || '-1.2 tCO2e'}
                            </div>
                          </div>
                        </div>
                        
                        {/* Allocation Changes */}
                        {action.body && machines && (
                          <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                            <h6 className="text-white/80 text-sm font-medium mb-3">Allocation Changes:</h6>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                              {Object.entries(action.body).map(([key, value]) => {
                                if (machines.hasOwnProperty(key)) {
                                  const currentValue = machines[key] ?? 0;
                                  const newValue = parseInt(value, 10);
                                  const diff = newValue - currentValue;

                                  return (
                                    <div key={key} className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                                      <span className="text-white/60 capitalize">{key.replace(/_/g, ' ')}:</span>
                                      <span className="text-white font-medium flex items-center">
                                        {newValue}
                                        {diff !== 0 && (
                                          <span className={`ml-2 text-xs font-mono ${diff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            ({diff > 0 ? `+${diff}` : diff})
                                          </span>
                                        )}
                                      </span>
                                    </div>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          </div>
                        )}
                        
                        {/* Wattson AI Insight */}
                        <div className="p-4 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-xl border border-orange-500/20">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-orange-500/20 rounded-lg flex-shrink-0">
                              <Brain className="w-4 h-4 text-orange-400" />
                            </div>
                            <div>
                              <div className="text-orange-300 text-xs font-medium mb-1">WATTSON AI INSIGHT</div>
                              <p className="text-orange-200 text-sm italic">
                                "{action.wattson_insight || 'Fascinating development: Market microstructure analysis reveals asymmetric profit potential in this temporal window.'}"
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Original Recommendations */}
            <div className="space-y-8">
              {recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                  <div key={index} className="group relative">
                    <div className={`absolute inset-0 bg-gradient-to-r ${getPriorityGradient(rec.priority)} rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                    
                    <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                      {/* Header Section */}
                      <div className="p-6 border-b border-white/5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 rounded-xl bg-white/10">
                              {getActionIcon(rec)}
                            </div>
                            <div>
                              <h3 className="text-xl font-medium text-white mb-1">{rec.title}</h3>
                              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${
                                rec.impact === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                rec.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                'bg-green-500/20 text-green-400 border-green-500/30'
                              }`}>
                                {rec.impact ? rec.impact.toUpperCase() : 'MEDIUM'} IMPACT
                              </span>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleSimulateAction(`sim-${index}`, rec)}
                              disabled={executingActions.has(`sim-${index}`) || executingActions.has(`exec-${index}`)}
                              className="flex items-center px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white text-sm rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {executingActions.has(`sim-${index}`) ? (
                                <>
                                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                                  Simulating
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  Simulate
                                </>
                              )}
                            </button>
                            
                            <button
                              onClick={() => handleExecuteAction(`exec-${index}`, rec)}
                              disabled={executingActions.has(`exec-${index}`) || executingActions.has(`sim-${index}`) || simulationMode}
                              className="flex items-center px-4 py-2 bg-orange-600/80 hover:bg-orange-600 text-white text-sm rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {executingActions.has(`exec-${index}`) ? (
                                <>
                                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                                  Executing
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Execute
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6 space-y-6">
                        <p className="text-white/80 text-base leading-relaxed">{rec.description}</p>
                        
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="text-white/60 text-xs mb-1">Confidence</div>
                            <div className={`font-mono text-lg ${getConfidenceColor(rec.confidence)}`}>
                              {rec.confidence}%
                            </div>
                          </div>
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="text-white/60 text-xs mb-1">Timeframe</div>
                            <div className="text-white text-lg font-medium">{rec.timeframe}</div>
                          </div>
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="text-white/60 text-xs mb-1">Profit Impact</div>
                            <div className="text-green-400 font-medium text-lg">{rec.profit_impact}</div>
                          </div>
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="text-white/60 text-xs mb-1">Carbon Impact</div>
                            <div className="text-emerald-400 font-medium text-lg">{rec.carbon_impact}</div>
                          </div>
                        </div>
                        
                        {/* Sherlock Insight */}
                        {rec.sherlock_insight && (
                          <div className="p-4 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-xl border border-orange-500/20">
                            <div className="flex items-start space-x-3">
                              <div className="p-2 bg-orange-500/20 rounded-lg flex-shrink-0">
                                <Brain className="w-4 h-4 text-orange-400" />
                              </div>
                              <div>
                                <div className="text-orange-300 text-xs font-medium mb-1">WATTSON AI INSIGHT</div>
                                <p className="text-orange-200 text-sm italic">"{rec.sherlock_insight}"</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Progress Section */}
                        {(executingActions.has(`sim-${index}`) || executingActions.has(`exec-${index}`)) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-white/5 rounded-xl p-4 border border-white/10"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                                <span className="text-white text-sm font-medium">
                                  {executingActions.has(`sim-${index}`) ? 'Running Simulation' : 'Executing Action'}
                                </span>
                              </div>
                              <span className="text-orange-400 text-sm font-mono">
                                {actionProgress[`sim-${index}`] || actionProgress[`exec-${index}`] || 0}%
                              </span>
                            </div>
                            
                            <div className="w-full bg-white/20 rounded-full h-2 mb-3">
                              <div 
                                className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${actionProgress[`sim-${index}`] || actionProgress[`exec-${index}`] || 0}%` }}
                              />
                            </div>
                            
                            <p className="text-white/70 text-sm">
                              {executionDetails[`sim-${index}`] || executionDetails[`exec-${index}`] || 'Initializing...'}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <AlertTriangle className="w-16 h-16 text-white/30 mx-auto mb-6" />
                  <h3 className="text-xl font-medium text-white mb-3">No Active Recommendations</h3>
                  <p className="text-white/60 font-light">All systems operating within optimal parameters. Wattson is monitoring for opportunities.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Action Controls */}
        <div 
          ref={actionsRef}
          className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
        >
          <h3 className="text-2xl font-light text-white mb-8">Emergency Controls</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button 
              onClick={() => handleEmergencyAction('emergency-stop')}
              className="group relative p-6 bg-red-600/20 hover:bg-red-600/30 rounded-2xl border border-red-500/30 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-rose-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative text-center space-y-3">
                <Pause className="w-8 h-8 text-red-400 mx-auto" />
                <div className="text-white font-medium">Emergency Stop</div>
                <div className="text-red-400/80 text-sm">Halt all operations</div>
              </div>
            </button>

            <button 
              onClick={() => handleEmergencyAction('deploy-batteries')}
              className="group relative p-6 bg-yellow-600/20 hover:bg-yellow-600/30 rounded-2xl border border-yellow-500/30 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative text-center space-y-3">
                <Battery className="w-8 h-8 text-yellow-400 mx-auto" />
                <div className="text-white font-medium">Deploy Batteries</div>
                <div className="text-yellow-400/80 text-sm">Activate energy reserves</div>
              </div>
            </button>

            <button 
              onClick={() => handleEmergencyAction('scale-mining')}
              className="group relative p-6 bg-blue-600/20 hover:bg-blue-600/30 rounded-2xl border border-blue-500/30 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative text-center space-y-3">
                <TrendingUp className="w-8 h-8 text-blue-400 mx-auto" />
                <div className="text-white font-medium">Scale Mining</div>
                <div className="text-blue-400/80 text-sm">Increase hash operations</div>
              </div>
            </button>

            <button 
              onClick={() => handleEmergencyAction('switch-inference')}
              className="group relative p-6 bg-emerald-600/20 hover:bg-emerald-600/30 rounded-2xl border border-emerald-500/30 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative text-center space-y-3">
                <Brain className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="text-white font-medium">Switch Inference</div>
                <div className="text-emerald-400/80 text-sm">Reallocate to AI compute</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      <SuccessNotification
        show={successNotification.show}
        title={successNotification.title}
        message={successNotification.message}
        impact={successNotification.impact}
        details={successNotification.details}
        onClose={() => setSuccessNotification(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default PremiumExecutionPage;