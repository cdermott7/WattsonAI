// Enhanced enterprise-grade mock data with forecasting and advanced analytics

// Generate realistic time series data
const generateTimeSeries = (baseValue, volatility, points = 48) => {
  const data = [];
  let current = baseValue;
  const now = new Date();
  
  for (let i = points - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * 5 * 60 * 1000)); // 5-minute intervals
    const change = (Math.random() - 0.5) * volatility;
    current = Math.max(current + change, baseValue * 0.5); // Prevent negative values
    
    data.push({
      timestamp: timestamp.toISOString(),
      value: current,
      confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
    });
  }
  
  return data;
};

// Generate future predictions
const generateForecast = (historical, hours = 12) => {
  const forecast = [];
  const lastValue = historical[historical.length - 1].value;
  const trend = (historical[historical.length - 1].value - historical[0].value) / historical.length;
  
  for (let i = 1; i <= hours; i++) {
    const timestamp = new Date(Date.now() + (i * 60 * 60 * 1000));
    const predicted = lastValue + (trend * i) + (Math.random() - 0.5) * lastValue * 0.1;
    const confidence = Math.max(0.4, 0.95 - (i * 0.05)); // Decreasing confidence over time
    
    forecast.push({
      timestamp: timestamp.toISOString(),
      value: Math.max(predicted, lastValue * 0.5),
      confidence,
      type: 'forecast'
    });
  }
  
  return forecast;
};

// Market data with forecasting
export const marketData = {
  energy: {
    current: 0.0647,
    historical: generateTimeSeries(0.065, 0.008),
    forecast: null, // Will be generated
    unit: '$/kWh',
    trend: 'decreasing',
    volatility: 'medium'
  },
  hash: {
    current: 8.44,
    historical: generateTimeSeries(8.5, 0.5),
    forecast: null,
    unit: '$/TH/s',
    trend: 'increasing',
    volatility: 'high'
  },
  token: {
    current: 2.91,
    historical: generateTimeSeries(2.9, 0.2),
    forecast: null,
    unit: '$/token',
    trend: 'stable',
    volatility: 'low'
  },
  difficulty: {
    current: 62.5e12,
    historical: generateTimeSeries(62e12, 1e12),
    forecast: null,
    unit: 'difficulty',
    trend: 'increasing',
    volatility: 'very_low'
  }
};

// Generate forecasts for all market data
Object.keys(marketData).forEach(key => {
  if (marketData[key].historical) {
    marketData[key].forecast = generateForecast(marketData[key].historical);
  }
});

// Fleet composition with detailed specs
export const fleetData = {
  miners: {
    air_cooled: {
      count: 150,
      hashrate: 100, // TH/s per unit
      power: 3200, // W per unit
      efficiency: 31.25, // J/TH
      status: 'active',
      location: 'Texas_Grid_A',
      temperature: 65,
      uptime: 99.2
    },
    hydro_cooled: {
      count: 200,
      hashrate: 120,
      power: 3600,
      efficiency: 30.0,
      status: 'active',
      location: 'Texas_Grid_B',
      temperature: 45,
      uptime: 99.7
    },
    immersion_cooled: {
      count: 100,
      hashrate: 140,
      power: 3800,
      efficiency: 27.1,
      status: 'active',
      location: 'Texas_Grid_C',
      temperature: 35,
      uptime: 99.9
    }
  },
  inference: {
    gpu_cluster_a: {
      count: 50,
      compute: 2000, // TFLOPS per unit
      power: 400, // W per unit
      tokens_per_hour: 50000,
      status: 'active',
      location: 'Virginia_DC',
      temperature: 42,
      utilization: 87.3
    },
    gpu_cluster_b: {
      count: 75,
      compute: 2500,
      power: 450,
      tokens_per_hour: 62500,
      status: 'active',
      location: 'Oregon_DC',
      temperature: 38,
      utilization: 92.1
    }
  },
  batteries: {
    grid_storage_a: {
      capacity: 50000, // kWh
      current_charge: 85.2, // %
      power_rating: 25000, // kW
      efficiency: 95.5,
      status: 'standby',
      location: 'Texas_Grid_A',
      cycles_remaining: 4750
    },
    grid_storage_b: {
      capacity: 100000,
      current_charge: 92.8,
      power_rating: 50000,
      efficiency: 96.2,
      status: 'charging',
      location: 'Texas_Grid_B',
      cycles_remaining: 5200
    }
  }
};

// AI Decision modules with advanced logic
export const aiModules = {
  profit_optimizer: {
    name: 'MLP Profit/Watt Optimizer',
    status: 'active',
    confidence: 94.2,
    last_action: '2 minutes ago',
    description: 'Multi-layer perceptron optimizing fleet allocation for maximum profit per watt',
    actions_today: 47,
    avg_improvement: '12.3%'
  },
  carbon_scorer: {
    name: 'Carbon Cost Scorer',
    status: 'active',
    confidence: 88.7,
    last_action: '5 minutes ago',
    description: 'Real-time carbon intensity analysis for sustainable operations',
    actions_today: 23,
    carbon_saved: '2.4 tCO2e'
  },
  geo_router: {
    name: 'Geographic Routing Optimizer',
    status: 'active',
    confidence: 91.5,
    last_action: '1 minute ago',
    description: 'Dynamic workload routing across global infrastructure',
    actions_today: 156,
    latency_improvement: '23ms avg'
  },
  forecast_engine: {
    name: 'LSTM Forecast Engine',
    status: 'active',
    confidence: 87.3,
    last_action: 'continuous',
    description: 'Long Short-Term Memory network for market prediction',
    predictions_today: 288,
    accuracy_rate: '89.2%'
  }
};

// Live events and notifications
export const liveEvents = [
  {
    id: 1,
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    type: 'optimization',
    severity: 'success',
    title: 'Profit Optimization Complete',
    message: 'Reallocated 25 GPU units from inference to mining. Expected profit increase: $847/hour',
    confidence: 94,
    module: 'profit_optimizer'
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    type: 'forecast',
    severity: 'warning',
    title: 'Energy Price Spike Predicted',
    message: 'LSTM model predicts 23% energy price increase in next 4 hours. Confidence: 87%',
    confidence: 87,
    module: 'forecast_engine'
  },
  {
    id: 3,
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    type: 'allocation',
    severity: 'info',
    title: 'Battery Discharge Initiated',
    message: 'Grid Storage B discharging 15MW to offset peak energy costs. Duration: 2 hours',
    confidence: 96,
    module: 'carbon_scorer'
  },
  {
    id: 4,
    timestamp: new Date(Date.now() - 22 * 60 * 1000),
    type: 'routing',
    severity: 'success',
    title: 'Workload Geo-Routing Optimized',
    message: 'Shifted 40% inference load to Oregon DC. Latency reduced by 18ms, cost down 12%',
    confidence: 91,
    module: 'geo_router'
  }
];

// Advanced AI recommendations with detailed analysis
export const aiRecommendations = [
  {
    id: 1,
    title: 'Strategic Battery Deployment',
    description: 'Deploy Grid Storage A during predicted energy spike (16:00-20:00 UTC)',
    impact: 'high',
    confidence: 94.2,
    profit_impact: '+$3,247/hour',
    carbon_impact: '-1.2 tCO2e',
    timeframe: '4 hours',
    reasoning: 'LSTM forecast indicates 28% energy price increase. Battery deployment will offset 65% of additional costs while maintaining full operation capacity.',
    prerequisites: ['Battery charge > 80%', 'Grid connection stable'],
    risk_assessment: 'Low - Standard operation within battery specifications',
    provenance: 'MLP Optimizer + Carbon Scorer + Historical Pattern Analysis',
    simulation_ready: true
  },
  {
    id: 2,
    title: 'Mining-to-Inference Reallocation',
    description: 'Convert 35 air-cooled miners to GPU inference workload',
    impact: 'medium',
    confidence: 87.6,
    profit_impact: '+$1,892/hour',
    carbon_impact: '-0.8 tCO2e',
    timeframe: '2 hours',
    reasoning: 'Token demand surge detected (+34% in last hour). Inference operations showing 23% higher profit margin than current hash rate value.',
    prerequisites: ['GPU availability', 'Inference queue depth > 50%'],
    risk_assessment: 'Medium - Requires hardware reconfiguration',
    provenance: 'Market Analysis + Demand Forecasting + Efficiency Models',
    simulation_ready: true
  },
  {
    id: 3,
    title: 'Geographic Load Balancing',
    description: 'Shift 60% of inference workload from Virginia to Oregon facility',
    impact: 'medium',
    confidence: 91.3,
    profit_impact: '+$954/hour',
    carbon_impact: '-0.3 tCO2e',
    timeframe: '30 minutes',
    reasoning: 'Oregon grid showing 15% lower carbon intensity and 8% lower energy costs. Virginia facility approaching thermal limits.',
    prerequisites: ['Network capacity available', 'Oregon utilization < 85%'],
    risk_assessment: 'Very Low - Software routing change only',
    provenance: 'Geo-Router + Carbon Intensity API + Thermal Monitoring',
    simulation_ready: true
  }
];

// Performance metrics with enterprise KPIs
export const performanceMetrics = {
  financial: {
    profit_per_hour: 12847.32,
    profit_per_watt: 0.0341,
    revenue_24h: 308336.68,
    cost_24h: 195489.45,
    margin_percent: 36.6,
    roi_annual: 127.3
  },
  operational: {
    fleet_uptime: 99.4,
    energy_efficiency: 95.7,
    hash_rate_stability: 98.9,
    inference_latency: 23.4,
    auto_optimizations: 234,
    manual_interventions: 3
  },
  sustainability: {
    carbon_intensity: 387, // gCO2/kWh
    renewable_percent: 67.8,
    carbon_saved_today: 4.7, // tCO2e
    efficiency_improvement: 12.3,
    pue_score: 1.09,
    water_usage: 45.2 // L/MWh
  }
};

// Simulation scenarios
export const simulationScenarios = [
  {
    id: 'energy_spike',
    name: 'Energy Price Spike (+30%)',
    description: 'Simulate response to sudden energy price increase',
    duration: '4 hours',
    impact_preview: {
      cost_increase: '$15,247',
      recommended_actions: 3,
      mitigation_effectiveness: '78%'
    }
  },
  {
    id: 'hash_crash',
    name: 'Hash Rate Crash (-40%)',
    description: 'Simulate mining profitability collapse scenario',
    duration: '8 hours',
    impact_preview: {
      revenue_loss: '$89,432',
      recommended_actions: 5,
      recovery_time: '2.3 hours'
    }
  },
  {
    id: 'inference_surge',
    name: 'AI Inference Demand Surge (+200%)',
    description: 'Simulate massive increase in compute demand',
    duration: '6 hours',
    impact_preview: {
      revenue_opportunity: '$67,891',
      required_reallocation: '85% of fleet',
      success_probability: '94%'
    }
  }
];

export default {
  marketData,
  fleetData,
  aiModules,
  liveEvents,
  aiRecommendations,
  performanceMetrics,
  simulationScenarios
};