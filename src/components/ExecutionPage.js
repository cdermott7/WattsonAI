import React, { useState, useEffect } from 'react';
import { fetchPrices, fetchInventory, calculateProfitability } from '../services/api';
import { WattsonAI } from '../utils/wattsonAI';
import { Play, Pause, TrendingDown, TrendingUp, Battery, Cpu, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const ExecutionPage = () => {
  const [data, setData] = useState({
    prices: [],
    inventory: null,
    profitability: null
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [simulationMode, setSimulationMode] = useState(false);
  const [executingActions, setExecutingActions] = useState(new Set());
  
  const wattson = new WattsonAI();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prices, inventory] = await Promise.all([
          fetchPrices(),
          fetchInventory()
        ]);
        
        const profitability = calculateProfitability(inventory, prices);
        const aiRecommendations = wattson.generateRecommendations(profitability);
        
        setData({ prices, inventory, profitability });
        setRecommendations(aiRecommendations);
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

  const handleSimulateAction = async (actionId, action) => {
    setExecutingActions(prev => new Set([...prev, actionId]));
    
    // Simulate action execution with delay
    setTimeout(() => {
      setExecutingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionId);
        return newSet;
      });
      
      // Update UI to show action completed
      console.log(`Simulated: ${action.action}`);
    }, 2000);
  };

  const handleExecuteAction = async (actionId, action) => {
    setExecutingActions(prev => new Set([...prev, actionId]));
    
    // Here you would integrate with actual MARA API to execute the action
    setTimeout(() => {
      setExecutingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionId);
        return newSet;
      });
      
      console.log(`Executed: ${action.action}`);
    }, 3000);
  };

  const getActionIcon = (action) => {
    if (action.toLowerCase().includes('reduce') || action.toLowerCase().includes('scale down')) {
      return <TrendingDown className="w-5 h-5 text-red-400" />;
    }
    if (action.toLowerCase().includes('scale up') || action.toLowerCase().includes('increase')) {
      return <TrendingUp className="w-5 h-5 text-green-400" />;
    }
    if (action.toLowerCase().includes('battery')) {
      return <Battery className="w-5 h-5 text-yellow-400" />;
    }
    return <Cpu className="w-5 h-5 text-blue-400" />;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-green-500 bg-green-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-orange-400">Wattson is analyzing execution strategies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-orange-400 mb-2">Execution Center</h1>
              <p className="text-gray-400">AI-powered optimization recommendations</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSimulationMode(!simulationMode)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  simulationMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {simulationMode ? 'Simulation Mode' : 'Live Mode'}
              </button>
            </div>
          </div>
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-2">Current Energy Cost</h3>
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              ${data.prices[0]?.energy_price?.toFixed(4) || '0.0000'}/kWh
            </div>
            <div className="text-sm text-gray-400">
              {data.prices.length >= 2 && (
                <>
                  {data.prices[0].energy_price > data.prices[1].energy_price ? (
                    <span className="text-red-400">
                      +{(((data.prices[0].energy_price - data.prices[1].energy_price) / data.prices[1].energy_price) * 100).toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-green-400">
                      {(((data.prices[0].energy_price - data.prices[1].energy_price) / data.prices[1].energy_price) * 100).toFixed(1)}%
                    </span>
                  )}
                  <span className="ml-1">vs last reading</span>
                </>
              )}
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-2">Hash Rate Value</h3>
            <div className="text-2xl font-bold text-blue-400 mb-1">
              ${data.prices[0]?.hash_price?.toFixed(2) || '0.00'}/TH
            </div>
            <div className="text-sm text-gray-400">
              {data.prices.length >= 2 && (
                <>
                  {data.prices[0].hash_price > data.prices[1].hash_price ? (
                    <span className="text-green-400">
                      +{(((data.prices[0].hash_price - data.prices[1].hash_price) / data.prices[1].hash_price) * 100).toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-red-400">
                      {(((data.prices[0].hash_price - data.prices[1].hash_price) / data.prices[1].hash_price) * 100).toFixed(1)}%
                    </span>
                  )}
                  <span className="ml-1">vs last reading</span>
                </>
              )}
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-2">Token Value</h3>
            <div className="text-2xl font-bold text-green-400 mb-1">
              ${data.prices[0]?.token_price?.toFixed(3) || '0.000'}
            </div>
            <div className="text-sm text-gray-400">
              Inference market rate
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Wattson's Recommendations</h2>
          <div className="space-y-4">
            {recommendations.length > 0 ? (
              recommendations.map((rec, index) => (
                <div key={index} className={`border rounded-lg p-6 ${getPriorityColor(rec.priority)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {getActionIcon(rec.action)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-white">{rec.action}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            rec.priority === 'high' ? 'bg-red-600 text-white' :
                            rec.priority === 'medium' ? 'bg-yellow-600 text-white' :
                            'bg-green-600 text-white'
                          }`}>
                            {rec.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-3">{rec.reason}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className={`font-medium ${getConfidenceColor(rec.confidence)}`}>
                            Confidence: {rec.confidence}%
                          </span>
                          <span className="text-gray-500">
                            Estimated impact: {rec.priority === 'high' ? 'High' : rec.priority === 'medium' ? 'Medium' : 'Low'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSimulateAction(`sim-${index}`, rec)}
                        disabled={executingActions.has(`sim-${index}`)}
                        className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        className="flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              ))
            ) : (
              <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
                <AlertTriangle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No Recommendations Available</h3>
                <p className="text-gray-400">Wattson is analyzing current market conditions. Check back in a few minutes.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-center p-4 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
              <Pause className="w-5 h-5 mr-2" />
              Emergency Stop
            </button>
            <button className="flex items-center justify-center p-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors">
              <Battery className="w-5 h-5 mr-2" />
              Activate Batteries
            </button>
            <button className="flex items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              <TrendingUp className="w-5 h-5 mr-2" />
              Scale Up Mining
            </button>
            <button className="flex items-center justify-center p-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
              <Cpu className="w-5 h-5 mr-2" />
              Switch to Inference
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionPage;