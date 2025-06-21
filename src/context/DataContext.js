import React, { createContext, useContext, useEffect, useReducer } from 'react';
import {
  analyzeGlobalContext,
  calculateProfitability,
  fetchInventory,
  fetchMachines,
  fetchPrices,
  updateMachines
} from '../services/api';

// Initial state
const initialState = {
  prices: [],
  inventory: null,
  profitability: null,
  machines: null,
  loading: true,
  isUpdating: false,
  error: null,
  lastUpdated: null,
  // Site configuration
  siteName: 'MaraHackathon',
  apiKey: '947a8153-edf4-4093-aa92-e6efe0bd2682',
  power: 1000000,
  // Analysis state
  analysis: null,
  isAnalyzing: false,
  analysisError: null
};

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_UPDATING: 'SET_UPDATING',
  SET_ERROR: 'SET_ERROR',
  SET_DATA: 'SET_DATA',
  UPDATE_MACHINES: 'UPDATE_MACHINES',
  REFRESH_DATA: 'REFRESH_DATA',
  UPDATE_SITE_CONFIG: 'UPDATE_SITE_CONFIG',
  SET_ANALYZING: 'SET_ANALYZING',
  SET_ANALYSIS: 'SET_ANALYSIS',
  SET_ANALYSIS_ERROR: 'SET_ANALYSIS_ERROR'
};

// Reducer function
const dataReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTIONS.SET_UPDATING:
      return { ...state, isUpdating: action.payload };
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false, isUpdating: false };
    
    case ACTIONS.SET_DATA:
      return {
        ...state,
        ...action.payload,
        loading: false,
        isUpdating: false,
        error: null,
        lastUpdated: new Date().toISOString()
      };
    
    case ACTIONS.UPDATE_MACHINES:
      return {
        ...state,
        machines: { ...state.machines, ...action.payload },
        isUpdating: false
      };
    
    case ACTIONS.REFRESH_DATA:
      return {
        ...state,
        lastUpdated: new Date().toISOString()
      };
    
    case ACTIONS.UPDATE_SITE_CONFIG:
      return {
        ...state,
        ...action.payload
      };
    
    case ACTIONS.SET_ANALYZING:
      return { ...state, isAnalyzing: action.payload };
    
    case ACTIONS.SET_ANALYSIS:
      return { 
        ...state, 
        analysis: action.payload, 
        isAnalyzing: false, 
        analysisError: null 
      };
    
    case ACTIONS.SET_ANALYSIS_ERROR:
      return { 
        ...state, 
        analysisError: action.payload, 
        isAnalyzing: false 
      };
    
    default:
      return state;
  }
};

// Create context
const DataContext = createContext();

// Provider component
export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Load data function
  const loadData = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      const [prices, inventory, machines] = await Promise.all([
        fetchPrices(),
        fetchInventory(),
        fetchMachines(state.apiKey)
      ]);
      
      const profitability = calculateProfitability(inventory, prices);
      
      dispatch({
        type: ACTIONS.SET_DATA,
        payload: { prices, inventory, profitability, machines }
      });
    } catch (error) {
      console.error('Error loading data:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Update machines function
  const updateMachinesData = async (allocation) => {
    try {
      dispatch({ type: ACTIONS.SET_UPDATING, payload: true });
      
      const updatedMachines = await updateMachines(state.apiKey, allocation);
      
      // Instead of reloading all data, just update the machines state
      dispatch({ 
        type: ACTIONS.UPDATE_MACHINES, 
        payload: updatedMachines 
      });
      
      // Optionally, you can still reload other data if needed, but we'll avoid it for now
      // to prevent the race condition. We'll refetch prices and inventory for profitability.
      const [prices, inventory] = await Promise.all([
        fetchPrices(),
        fetchInventory(),
      ]);
      const profitability = calculateProfitability(inventory, prices);

      dispatch({
        type: ACTIONS.SET_DATA,
        payload: { 
          prices, 
          inventory, 
          profitability, 
          machines: updatedMachines // Ensure machines data is the latest
        }
      });

    } catch (error) {
      console.error('Error updating machines:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Refresh data function
  const refreshData = async () => {
    dispatch({ type: ACTIONS.REFRESH_DATA });
    await loadData();
  };

  // Update site configuration function
  const updateSiteConfig = (config) => {
    dispatch({ 
      type: ACTIONS.UPDATE_SITE_CONFIG, 
      payload: config 
    });
  };

  // Perform AI analysis function
  const performAnalysis = async () => {
    try {
      dispatch({ type: ACTIONS.SET_ANALYZING, payload: true });
      
      // Prepare global context for analysis
      const globalContext = {
        prices: state.prices,
        inventory: state.inventory,
        profitability: state.profitability,
        machines: state.machines,
        siteName: state.siteName,
        power: state.power,
        lastUpdated: state.lastUpdated
      };
      
      const analysisResult = await analyzeGlobalContext(globalContext, state.apiKey);
      
      dispatch({ 
        type: ACTIONS.SET_ANALYSIS, 
        payload: analysisResult 
      });
      
      return analysisResult;
    } catch (error) {
      console.error('Error performing analysis:', error);
      dispatch({ 
        type: ACTIONS.SET_ANALYSIS_ERROR, 
        payload: error.message 
      });
      throw error;
    }
  };

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    loadData();
    
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Context value
  const value = {
    ...state,
    loadData,
    updateMachinesData,
    refreshData,
    updateSiteConfig,
    performAnalysis,
    dispatch
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Utility functions for data formatting
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 4 : 2
  }).format(value);
};

export const formatChartData = (prices) => {
  return prices.slice().reverse().map((price, index) => ({
    time: new Date(price.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    energy: price.energy_price,
    hash: price.hash_price,
    token: price.token_price,
    index,
    timestamp: price.timestamp
  }));
};

export const getMetricColor = (metric) => {
  switch (metric) {
    case 'energy': return { primary: '#EAB308', secondary: '#F59E0B', gradient: 'from-yellow-500 to-amber-600' };
    case 'hash': return { primary: '#3B82F6', secondary: '#2563EB', gradient: 'from-blue-500 to-blue-600' };
    case 'token': return { primary: '#10B981', secondary: '#059669', gradient: 'from-emerald-500 to-teal-600' };
    default: return { primary: '#6B7280', secondary: '#4B5563', gradient: 'from-gray-500 to-gray-600' };
  }
}; 