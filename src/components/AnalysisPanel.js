import {
  AlertTriangle,
  Brain,
  CheckCircle,
  Loader2,
  Play,
  TrendingDown,
  TrendingUp,
  XCircle,
  Zap
} from 'lucide-react';

import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';

const AnalysisPanel = () => {
  const { 
    analysis, 
    isAnalyzing, 
    analysisError, 
    performAnalysis,
    updateMachinesData 
  } = useData();

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'green':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'yellow':
        return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
      case 'red':
        return <XCircle className="w-6 h-6 text-red-400" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-gray-400" />;
    }
  };

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

  const handleExecuteAction = async (action) => {
    if (action.type === 'api_call' && action.body) {
      try {
        await updateMachinesData(action.body);
        // Optionally refresh analysis after execution
        setTimeout(() => {
          performAnalysis();
        }, 2000);
      } catch (error) {
        console.error('Error executing action:', error);
      }
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-2xl font-light text-white">AI Analysis</h3>
            <p className="text-white/60 text-sm">Wattson AI-powered insights and recommendations</p>
          </div>
        </div>
        
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
      </div>

      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
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
        </motion.div>
      )}

      {analysisError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-red-500/10 rounded-xl border border-red-500/20"
        >
          <div className="flex items-center space-x-3">
            <XCircle className="w-6 h-6 text-red-400" />
            <div>
              <h4 className="text-red-400 font-medium">Analysis Error</h4>
              <p className="text-red-400/80 text-sm">{analysisError}</p>
            </div>
          </div>
        </motion.div>
      )}

      {analysis && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Status */}
          <div className={`p-6 rounded-xl border bg-gradient-to-r ${getStatusColor(analysis.status)}`}>
            <div className="flex items-center space-x-3 mb-4">
              {getStatusIcon(analysis.status)}
              <div>
                <h4 className="text-white font-medium">System Status</h4>
                <p className="text-white/60 text-sm">Current operational health</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                analysis.status?.toLowerCase() === 'green' ? 'bg-green-500/20 text-green-400' :
                analysis.status?.toLowerCase() === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                analysis.status?.toLowerCase() === 'red' ? 'bg-red-500/20 text-red-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {analysis.status?.toUpperCase() || 'UNKNOWN'}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h4 className="text-white font-medium">Market Summary</h4>
            </div>
            <p className="text-white/80 leading-relaxed">
              {analysis.summary || 'No summary available'}
            </p>
          </div>

          {/* Actions */}
          {analysis.actions && analysis.actions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-orange-400" />
                <h4 className="text-white font-medium">Recommended Actions</h4>
              </div>
              
              {analysis.actions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/5 rounded-xl border border-white/10"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h5 className="text-white font-medium mb-1">
                        {action.type === 'api_call' ? 'Update Machine Allocation' : action.type}
                      </h5>
                      <p className="text-white/60 text-sm">
                        {action.description || 'No description available'}
                      </p>
                    </div>
                    
                    {action.type === 'api_call' && action.body && (
                      <motion.button
                        onClick={() => handleExecuteAction(action)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-lg transition-all backdrop-blur-sm shadow-lg"
                      >
                        <Play className="w-4 h-4" />
                        <span className="text-sm">Execute</span>
                      </motion.button>
                    )}
                  </div>
                  
                  {action.body && (
                    <div className="bg-black/20 rounded-lg p-3">
                      <h6 className="text-white/80 text-sm font-medium mb-2">Allocation Changes:</h6>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                        {Object.entries(action.body).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-white/60">{key.replace(/_/g, ' ')}:</span>
                            <span className="text-white font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {(!analysis.actions || analysis.actions.length === 0) && (
            <div className="p-6 bg-white/5 rounded-xl border border-white/10 text-center">
              <TrendingDown className="w-8 h-8 text-white/40 mx-auto mb-3" />
              <p className="text-white/60">No specific actions recommended at this time</p>
            </div>
          )}
        </motion.div>
      )}

      {!analysis && !isAnalyzing && !analysisError && (
        <div className="text-center py-12">
          <Brain className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <h4 className="text-white font-medium mb-2">Ready for Analysis</h4>
          <p className="text-white/60 text-sm">
            Click "Run Analysis" to get AI-powered insights and recommendations
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalysisPanel; 