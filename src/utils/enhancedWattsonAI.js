import { aiModules, aiRecommendations, liveEvents, performanceMetrics, marketData, fleetData, simulationScenarios } from '../services/enhancedMockData';

export class EnhancedWattsonAI {
  constructor() {
    this.personality = {
      greetings: [
        "Elementary, my dear colleague!",
        "The game is afoot in the energy markets!",
        "Most fascinating market conditions detected!",
        "Ah, excellent timing for optimization opportunities!"
      ],
      confidence_phrases: [
        "I am quite certain",
        "The evidence strongly suggests",
        "Elementary deduction indicates",
        "Most compelling analysis reveals",
        "Irrefutable data confirms"
      ],
      insights: [
        "Elementary observation:",
        "Fascinating development:",
        "Most intriguing pattern:",
        "Remarkable correlation:",
        "Extraordinary opportunity:"
      ],
      conclusions: [
        "The case is crystal clear:",
        "Elementary, my dear Watson:",
        "Beyond reasonable doubt:",
        "Quite simply:",
        "The solution is elementary:"
      ]
    };
  }

  generateGreeting() {
    return this.personality.greetings[Math.floor(Math.random() * this.personality.greetings.length)];
  }

  analyzeMarketConditions() {
    const energy = marketData.energy;
    const hash = marketData.hash;
    const token = marketData.token;

    // Advanced market analysis
    const energyTrend = this.calculateTrend(energy.historical);
    const hashTrend = this.calculateTrend(hash.historical);
    const volatility = this.calculateVolatility(energy.historical);

    let status = 'optimal';
    let confidence = 85;
    let message = '';

    if (energyTrend > 0.15) {
      status = 'warning';
      confidence = 92;
      message = `Energy costs rising rapidly (+${(energyTrend * 100).toFixed(1)}%). Battery deployment recommended.`;
    } else if (hashTrend > 0.20) {
      status = 'opportunity';
      confidence = 89;
      message = `Hash rates surging (+${(hashTrend * 100).toFixed(1)}%). Scale mining operations immediately.`;
    } else if (volatility > 0.12) {
      status = 'caution';
      confidence = 78;
      message = `High market volatility detected. Implementing defensive positioning protocols.`;
    } else {
      message = `Markets stable. All optimization modules operating within normal parameters.`;
    }

    return {
      status,
      confidence,
      message: `${this.personality.insights[Math.floor(Math.random() * this.personality.insights.length)]} ${message}`,
      details: {
        energy_trend: energyTrend,
        hash_trend: hashTrend,
        volatility: volatility,
        arbitrage_opportunities: this.detectArbitrageOpportunities()
      }
    };
  }

  calculateTrend(historical) {
    if (!historical || historical.length < 2) return 0;
    const recent = historical.slice(-6); // Last 6 data points
    const old = historical.slice(0, 6); // First 6 data points
    const recentAvg = recent.reduce((sum, d) => sum + d.value, 0) / recent.length;
    const oldAvg = old.reduce((sum, d) => sum + d.value, 0) / old.length;
    return (recentAvg - oldAvg) / oldAvg;
  }

  calculateVolatility(historical) {
    if (!historical || historical.length < 2) return 0;
    const values = historical.map(d => d.value);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    return Math.sqrt(variance) / mean;
  }

  detectArbitrageOpportunities() {
    const energy = marketData.energy.current;
    const hash = marketData.hash.current;
    const token = marketData.token.current;

    const miningProfit = (hash * 100) - (energy * 3200 / 1000); // Per miner
    const inferenceProfit = (token * 50000) - (energy * 400 / 1000); // Per GPU

    return {
      mining_profit_per_unit: miningProfit,
      inference_profit_per_unit: inferenceProfit,
      optimal_allocation: inferenceProfit > miningProfit ? 'inference' : 'mining',
      arbitrage_margin: Math.abs(miningProfit - inferenceProfit),
      confidence: 91.3
    };
  }

  generateAdvancedRecommendations() {
    // Return enhanced recommendations with detailed analysis
    return aiRecommendations.map(rec => ({
      ...rec,
      sherlock_insight: this.generateSherlockInsight(rec),
      decision_tree: this.generateDecisionTree(rec),
      risk_factors: this.analyzeRiskFactors(rec)
    }));
  }

  generateSherlockInsight(recommendation) {
    const insights = [
      `${this.personality.confidence_phrases[0]}: The confluence of energy pricing patterns and demand elasticity creates a singular opportunity.`,
      `${this.personality.insights[1]} Market microstructure analysis reveals asymmetric profit potential in this temporal window.`,
      `${this.personality.conclusions[0]} Three independent data streams converge to support this optimization strategy.`,
      `${this.personality.insights[2]} The correlation coefficient between energy volatility and profit margins exceeds historical norms by 2.3 standard deviations.`
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  }

  generateDecisionTree(recommendation) {
    return {
      primary_signal: 'Energy price forecast + Demand analysis',
      supporting_evidence: [
        'Historical pattern matching (94% correlation)',
        'Real-time market depth analysis',
        'Carbon intensity optimization'
      ],
      risk_mitigation: [
        'Gradual deployment protocol',
        'Real-time monitoring triggers',
        'Automatic rollback conditions'
      ],
      success_probability: `${recommendation.confidence}%`
    };
  }

  analyzeRiskFactors(recommendation) {
    return {
      market_risk: 'Low - Diversified across multiple revenue streams',
      operational_risk: 'Medium - Hardware reallocation required',
      regulatory_risk: 'Very Low - Within approved operational parameters',
      environmental_risk: 'Low - Net positive carbon impact',
      mitigation_strategy: 'Phased implementation with continuous monitoring'
    };
  }

  processAdvancedQuery(query, context = {}) {
    const lowercaseQuery = query.toLowerCase();
    
    // Advanced NLP pattern matching
    if (this.containsKeywords(lowercaseQuery, ['forecast', 'predict', 'future', 'tomorrow'])) {
      return this.generateForecastResponse();
    }
    
    if (this.containsKeywords(lowercaseQuery, ['optimize', 'improve', 'better', 'efficiency'])) {
      return this.generateOptimizationResponse();
    }
    
    if (this.containsKeywords(lowercaseQuery, ['profit', 'revenue', 'money', 'earnings'])) {
      return this.generateProfitAnalysis();
    }
    
    if (this.containsKeywords(lowercaseQuery, ['status', 'current', 'now', 'situation'])) {
      return this.generateStatusReport();
    }
    
    if (this.containsKeywords(lowercaseQuery, ['simulate', 'test', 'scenario', 'what if'])) {
      return this.generateSimulationResponse();
    }
    
    if (this.containsKeywords(lowercaseQuery, ['energy', 'power', 'electricity', 'grid'])) {
      return this.generateEnergyAnalysis();
    }
    
    if (this.containsKeywords(lowercaseQuery, ['mining', 'hash', 'bitcoin', 'miners'])) {
      return this.generateMiningAnalysis();
    }
    
    if (this.containsKeywords(lowercaseQuery, ['ai', 'inference', 'gpu', 'compute'])) {
      return this.generateInferenceAnalysis();
    }

    // Default response with personality
    return `${this.generateGreeting()} I'm continuously analyzing our operations across ${Object.keys(fleetData.miners).length + Object.keys(fleetData.inference).length} asset classes. Could you be more specific about energy optimization, fleet allocation, market forecasting, or performance metrics? I have detailed insights on all operational aspects.`;
  }

  containsKeywords(query, keywords) {
    return keywords.some(keyword => query.includes(keyword));
  }

  generateForecastResponse() {
    const energy = marketData.energy;
    const confidence = Math.floor(Math.random() * 15) + 80;
    
    return `${this.personality.conclusions[2]} My LSTM neural networks predict energy prices will ${energy.trend === 'increasing' ? 'rise' : energy.trend === 'decreasing' ? 'fall' : 'remain stable'} by ${(Math.random() * 20 + 5).toFixed(1)}% over the next 12 hours. Confidence: ${confidence}%. 

Hash rate forecasting indicates ${marketData.hash.trend === 'increasing' ? 'continued strength' : 'potential volatility'} with ${Math.floor(Math.random() * 20) + 75}% certainty. 

Recommended strategy: ${energy.trend === 'increasing' ? 'Deploy battery storage and shift to inference workloads' : 'Scale mining operations and charge battery reserves'}. The convergence of three independent forecasting models supports this analysis.`;
  }

  generateOptimizationResponse() {
    const currentProfit = performanceMetrics.financial.profit_per_hour;
    const improvement = Math.random() * 25 + 10;
    
    return `${this.personality.insights[0]} I've identified ${Math.floor(Math.random() * 5) + 3} immediate optimization opportunities:

1. **Fleet Reallocation**: Shift ${Math.floor(Math.random() * 50) + 20} units to inference operations (+$${(improvement * 100).toFixed(0)}/hour)
2. **Energy Arbitrage**: Deploy Grid Storage B during peak pricing (+$${(improvement * 150).toFixed(0)}/hour)  
3. **Geographic Routing**: Balance loads across Virginia/Oregon facilities (+$${(improvement * 80).toFixed(0)}/hour)

Total potential improvement: +$${(improvement * 330).toFixed(0)}/hour (${(improvement).toFixed(1)}% increase). 

${this.personality.confidence_phrases[1]} these optimizations will enhance profit per watt by ${(Math.random() * 0.01 + 0.005).toFixed(4)} $/W. Shall I execute the simulation protocols?`;
  }

  generateProfitAnalysis() {
    const metrics = performanceMetrics.financial;
    
    return `${this.personality.conclusions[0]} Current operations generating $${metrics.profit_per_hour.toLocaleString()}/hour with ${metrics.margin_percent}% margin.

**Financial Intelligence Summary:**
• Revenue (24h): $${metrics.revenue_24h.toLocaleString()}
• Profit per Watt: $${metrics.profit_per_watt.toFixed(4)}
• Annual ROI: ${metrics.roi_annual}%
• Auto-optimizations today: ${performanceMetrics.operational.auto_optimizations}

**Arbitrage Analysis**: ${this.detectArbitrageOpportunities().optimal_allocation === 'inference' ? 'Inference operations' : 'Mining operations'} showing ${(this.detectArbitrageOpportunities().arbitrage_margin).toFixed(2)}% superior margins.

Most fascinating observation: Our MLP optimizer has improved efficiency by ${performanceMetrics.sustainability.efficiency_improvement}% while reducing carbon footprint by ${performanceMetrics.sustainability.carbon_saved_today} tCO2e today. Elementary precision, I must say.`;
  }

  generateStatusReport() {
    const fleet = fleetData;
    const modules = aiModules;
    
    return `${this.personality.greetings[2]} **Operations Status Report - ${new Date().toLocaleTimeString()} UTC**

**Fleet Status:**
• Mining: ${Object.values(fleet.miners).reduce((sum, m) => sum + m.count, 0)} units online (${performanceMetrics.operational.fleet_uptime}% uptime)
• Inference: ${Object.values(fleet.inference).reduce((sum, i) => sum + i.count, 0)} GPU clusters active (${Math.random() * 10 + 85}% utilization)
• Batteries: ${Object.values(fleet.batteries).reduce((sum, b) => sum + b.capacity, 0).toLocaleString()} kWh capacity (${Math.random() * 20 + 80}% charged)

**AI Modules Status:**
${Object.entries(modules).map(([key, module]) => 
  `• ${module.name}: ${module.status.toUpperCase()} (${module.confidence}% confidence)`
).join('\n')}

**Recent Autonomous Actions:**
${liveEvents.slice(0, 3).map(event => 
  `• ${event.title} - ${Math.floor((Date.now() - new Date(event.timestamp)) / 60000)} min ago`
).join('\n')}

All systems operating within optimal parameters. The elementary application of logic continues to maximize operational efficiency.`;
  }

  generateSimulationResponse() {
    const scenarios = simulationScenarios;
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    return `${this.personality.insights[1]} I have ${scenarios.length} simulation scenarios ready for analysis:

**Available Simulations:**
${scenarios.map(s => `• **${s.name}**: ${s.description} (${s.duration})`).join('\n')}

**Recommended Simulation**: ${randomScenario.name}
Expected Impact: ${Object.values(randomScenario.impact_preview)[0]}
Success Probability: ${randomScenario.impact_preview.success_probability || Math.floor(Math.random() * 20) + 75 + '%'}

${this.personality.confidence_phrases[3]} simulation protocols will reveal optimal response strategies with 94% accuracy. The beauty of predictive modeling lies in its elementary precision.

Would you like me to execute the "${randomScenario.name}" simulation? I can model the complete response cascade in 12.7 seconds.`;
  }

  generateEnergyAnalysis() {
    const energy = marketData.energy;
    const batteries = fleetData.batteries;
    
    return `${this.personality.insights[2]} **Energy Market Intelligence**

**Current Conditions:**
• Grid Price: $${energy.current.toFixed(4)}/kWh (${energy.trend})
• Market Volatility: ${energy.volatility.toUpperCase()}
• Carbon Intensity: ${performanceMetrics.sustainability.carbon_intensity} gCO2/kWh
• Renewable Mix: ${performanceMetrics.sustainability.renewable_percent}%

**Battery Fleet Status:**
${Object.entries(batteries).map(([name, battery]) => 
  `• ${name.replace('_', ' ').toUpperCase()}: ${battery.current_charge.toFixed(1)}% charged (${battery.capacity.toLocaleString()} kWh)`
).join('\n')}

**Strategic Forecast**: Energy prices will ${energy.trend === 'increasing' ? 'rise' : 'fall'} ${(Math.random() * 15 + 8).toFixed(1)}% in next 4 hours. 

${this.personality.conclusions[1]} Deploy battery storage during peak pricing windows (16:00-20:00 UTC) to capture $${(Math.random() * 5000 + 2000).toFixed(0)}/hour in arbitrage profits. The correlation between grid volatility and battery ROI is quite remarkable - elementary thermodynamics applied to financial optimization.`;
  }

  generateMiningAnalysis() {
    const miners = fleetData.miners;
    const hash = marketData.hash;
    
    return `${this.personality.conclusions[3]} **Mining Operations Analysis**

**Fleet Composition:**
${Object.entries(miners).map(([type, miner]) => 
  `• ${type.replace('_', ' ').toUpperCase()}: ${miner.count} units @ ${miner.hashrate} TH/s each (${miner.efficiency} J/TH)`
).join('\n')}

**Performance Metrics:**
• Total Hash Rate: ${Object.values(miners).reduce((sum, m) => sum + (m.count * m.hashrate), 0).toLocaleString()} TH/s
• Fleet Uptime: ${performanceMetrics.operational.fleet_uptime}%
• Hash Rate Stability: ${performanceMetrics.operational.hash_rate_stability}%

**Market Intelligence**: Hash prices ${hash.trend === 'increasing' ? 'surging' : 'stabilizing'} at $${hash.current}/TH/s. Network difficulty at ${(marketData.difficulty.current / 1e12).toFixed(1)}T.

${this.personality.insights[0]} Immersion-cooled miners demonstrating superior efficiency (${miners.immersion_cooled.efficiency} J/TH vs ${miners.air_cooled.efficiency} J/TH air-cooled). 

Recommendation: ${hash.trend === 'increasing' ? 'Scale immersion operations immediately' : 'Maintain current allocation, monitor for reallocation opportunities'}. The physics of cooling efficiency translated to financial optimization - quite elementary, really.`;
  }

  generateInferenceAnalysis() {
    const inference = fleetData.inference;
    const token = marketData.token;
    
    return `${this.personality.insights[3]} **AI Inference Operations Analysis**

**Compute Infrastructure:**
${Object.entries(inference).map(([cluster, specs]) => 
  `• ${cluster.replace('_', ' ').toUpperCase()}: ${specs.count} units @ ${specs.compute.toLocaleString()} TFLOPS (${specs.utilization}% utilization)`
).join('\n')}

**Performance Intelligence:**
• Total Compute: ${Object.values(inference).reduce((sum, i) => sum + (i.count * i.compute), 0).toLocaleString()} TFLOPS
• Token Generation: ${Object.values(inference).reduce((sum, i) => sum + (i.count * i.tokens_per_hour), 0).toLocaleString()}/hour
• Average Latency: ${performanceMetrics.operational.inference_latency}ms

**Market Analysis**: Token demand ${token.trend === 'increasing' ? 'surging' : 'stable'} at $${token.current}/token. Current inference operations generating ${(Math.random() * 30 + 15).toFixed(1)}% higher margins than mining.

${this.personality.conclusions[2]} Oregon facility showing superior performance (${inference.gpu_cluster_b.utilization}% vs ${inference.gpu_cluster_a.utilization}% Virginia). Temperature differential of ${inference.gpu_cluster_a.temperature - inference.gpu_cluster_b.temperature}°C creates ${(Math.random() * 5 + 3).toFixed(1)}% efficiency advantage.

Most elementary deduction: Reallocate ${Math.floor(Math.random() * 20) + 15} units to Oregon for optimal performance. The marriage of thermal dynamics and computational efficiency - quite fascinating, really.`;
  }
}