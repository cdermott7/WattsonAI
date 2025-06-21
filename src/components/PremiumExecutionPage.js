import React, { useState, useEffect } from 'react';
import { fetchPrices, fetchInventory, calculateProfitability } from '../services/api';
import { EnhancedWattsonAI } from '../utils/enhancedWattsonAI';
import { simulationScenarios, aiRecommendations } from '../services/enhancedMockData';
import { useLiquidGlass } from './SimpleLiquidGlass';
import { 
  Play, 
  Pause, 
  TrendingDown, 
  TrendingUp, 
  Battery, 
  Cpu, 
  Brain,
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Target,
  Activity
} from 'lucide-react';

const PremiumExecutionPage = () => {
  const [data, setData] = useState({ prices: [], inventory: null, profitability: null });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [simulationMode, setSimulationMode] = useState(false);
  const [executingActions, setExecutingActions] = useState(new Set());
  
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
    
    setTimeout(() => {
      setExecutingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionId);
        return newSet;
      });
    }, 2000);
  };

  const handleExecuteAction = async (actionId, action) => {
    setExecutingActions(prev => new Set([...prev, actionId]));
    
    setTimeout(() => {
      setExecutingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionId);
        return newSet;
      });
    }, 3000);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-orange-500/20 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-orange-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-white/80 mt-6 text-lg font-light">Analyzing execution strategies...</p>
        </div>
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
          className="relative mb-16 rounded-3xl p-12 bg-gradient-to-r from-black/40 to-gray-900/40 backdrop-blur-xl border border-white/10"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-extralight text-white tracking-tight">Execution Center</h1>
                  <p className="text-xl text-white/60 font-light">AI-Powered Strategic Operations</p>
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

            {/* Mode Toggle */}
            <div className="text-center space-y-4">
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

        {/* AI Recommendations */}
        <div 
          ref={recommendationsRef}
          className="mb-12 bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
        >
          <div className="flex items-center space-x-4 mb-8">
            <Brain className="w-8 h-8 text-orange-400" />
            <h2 className="text-3xl font-light text-white">Wattson's Strategic Recommendations</h2>
          </div>

          <div className="space-y-6">
            {recommendations.length > 0 ? (
              recommendations.map((rec, index) => (
                <div key={index} className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${getPriorityGradient(rec.priority)} rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                  
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-6 flex-1">
                        <div className="p-3 rounded-xl bg-white/10">
                          {getActionIcon(rec)}
                        </div>
                        
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-xl font-medium text-white">{rec.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                              rec.impact === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                              rec.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                              'bg-green-500/20 text-green-400 border-green-500/30'
                            }`}>
                              {rec.impact ? rec.impact.toUpperCase() : 'MEDIUM'} IMPACT
                            </span>
                          </div>
                          
                          <p className="text-white/80 text-lg leading-relaxed">{rec.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-white/60">Confidence:</span>
                                <span className={`font-mono ${getConfidenceColor(rec.confidence)}`}>
                                  {rec.confidence}%
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-white/60">Timeframe:</span>
                                <span className="text-white">{rec.timeframe}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-white/60">Profit Impact:</span>
                                <span className="text-green-400 font-medium">{rec.profit_impact}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-white/60">Carbon Impact:</span>
                                <span className="text-emerald-400 font-medium">{rec.carbon_impact}</span>
                              </div>
                            </div>
                          </div>
                          
                          {rec.sherlock_insight && (
                            <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                              <p className="text-orange-200 text-sm italic">"{rec.sherlock_insight}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleSimulateAction(`sim-${index}`, rec)}
                          disabled={executingActions.has(`sim-${index}`)}
                          className="flex items-center px-6 py-3 bg-blue-600/80 hover:bg-blue-600 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
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
                          disabled={executingActions.has(`exec-${index}`) || simulationMode}
                          className="flex items-center px-6 py-3 bg-orange-600/80 hover:bg-orange-600 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
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
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                <AlertTriangle className="w-16 h-16 text-white/30 mx-auto mb-6" />
                <h3 className="text-xl font-medium text-white mb-3">No Active Recommendations</h3>
                <p className="text-white/60 font-light">All systems operating within optimal parameters. Wattson is monitoring for opportunities.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Action Controls */}
        <div 
          ref={actionsRef}
          className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
        >
          <h3 className="text-2xl font-light text-white mb-8">Emergency Controls</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button className="group relative p-6 bg-red-600/20 hover:bg-red-600/30 rounded-2xl border border-red-500/30 transition-all">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-rose-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative text-center space-y-3">
                <Pause className="w-8 h-8 text-red-400 mx-auto" />
                <div className="text-white font-medium">Emergency Stop</div>
                <div className="text-red-400/80 text-sm">Halt all operations</div>
              </div>
            </button>

            <button className="group relative p-6 bg-yellow-600/20 hover:bg-yellow-600/30 rounded-2xl border border-yellow-500/30 transition-all">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative text-center space-y-3">
                <Battery className="w-8 h-8 text-yellow-400 mx-auto" />
                <div className="text-white font-medium">Deploy Batteries</div>
                <div className="text-yellow-400/80 text-sm">Activate energy reserves</div>
              </div>
            </button>

            <button className="group relative p-6 bg-blue-600/20 hover:bg-blue-600/30 rounded-2xl border border-blue-500/30 transition-all">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative text-center space-y-3">
                <TrendingUp className="w-8 h-8 text-blue-400 mx-auto" />
                <div className="text-white font-medium">Scale Mining</div>
                <div className="text-blue-400/80 text-sm">Increase hash operations</div>
              </div>
            </button>

            <button className="group relative p-6 bg-emerald-600/20 hover:bg-emerald-600/30 rounded-2xl border border-emerald-500/30 transition-all">
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
    </div>
  );
};

export default PremiumExecutionPage;