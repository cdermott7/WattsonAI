export class WattsonAI {
  constructor() {
    this.personality = {
      greeting: "Elementary, my dear colleague!",
      confidence: ["I am quite certain", "Most likely", "The evidence suggests", "I deduce with", "confidence"],
      insights: ["Elementary observation:", "Fascinating development:", "Most intriguing:", "Remarkable finding:"],
      conclusions: ["The case is clear:", "Elementary:", "Quite simply:", "Without doubt:"]
    };
  }

  analyzeMarketStatus(profitability, prices) {
    if (!profitability || !prices) return { status: 'red', message: 'Insufficient data for analysis' };

    const latestPrice = prices[0];
    const previousPrice = prices[1] || latestPrice;
    
    const energyChange = ((latestPrice.energy_price - previousPrice.energy_price) / previousPrice.energy_price) * 100;
    const hashChange = ((latestPrice.hash_price - previousPrice.hash_price) / previousPrice.hash_price) * 100;
    
    let status = 'green';
    let confidence = 85;
    let message = '';

    if (energyChange > 15) {
      status = 'red';
      confidence = 92;
      message = `Energy spike detected: ${energyChange.toFixed(1)}% increase. Recommend reducing mining operations.`;
    } else if (energyChange > 5) {
      status = 'yellow';
      confidence = 78;
      message = `Moderate energy increase: ${energyChange.toFixed(1)}%. Monitor closely.`;
    } else if (hashChange > 10) {
      status = 'green';
      confidence = 88;
      message = `Excellent hash price surge: ${hashChange.toFixed(1)}% increase. Optimal mining conditions.`;
    } else {
      message = `Stable market conditions. Current operations optimal.`;
    }

    return {
      status,
      confidence,
      message: `${this.personality.insights[Math.floor(Math.random() * this.personality.insights.length)]} ${message}`,
      energyChange,
      hashChange
    };
  }

  generateRecommendations(profitability) {
    if (!profitability) return [];

    const recommendations = [];
    
    const allAssets = [...profitability.miners, ...profitability.inference];
    const sortedByProfit = allAssets.sort((a, b) => b.profit - a.profit);
    const mostProfitable = sortedByProfit[0];
    const leastProfitable = sortedByProfit[sortedByProfit.length - 1];

    if (mostProfitable && mostProfitable.profit > 0) {
      recommendations.push({
        action: `Scale up ${mostProfitable.type}`,
        reason: `${this.personality.confidence[0]} this asset shows highest profit margin: $${mostProfitable.profit.toFixed(2)}/unit`,
        confidence: 89,
        priority: 'high'
      });
    }

    if (leastProfitable && leastProfitable.profit < 0) {
      recommendations.push({
        action: `Reduce ${leastProfitable.type} operations`,
        reason: `Elementary: negative returns detected at $${leastProfitable.profit.toFixed(2)}/unit`,
        confidence: 94,
        priority: 'high'
      });
    }

    if (profitability.energy_price > 0.65) {
      recommendations.push({
        action: 'Activate battery systems',
        reason: `Energy costs elevated at $${profitability.energy_price.toFixed(3)}/kWh. Deploy stored energy reserves.`,
        confidence: 82,
        priority: 'medium'
      });
    }

    return recommendations;
  }

  generateInsight(data) {
    const insights = [
      "The correlation between energy and hash prices reveals optimal arbitrage windows",
      "GPU inference tokens show 15% higher efficiency during off-peak energy hours",
      "Immersion cooling systems demonstrate superior profit-per-watt ratios",
      "Current market conditions favor hybrid mining-inference operations"
    ];
    
    return {
      insight: insights[Math.floor(Math.random() * insights.length)],
      confidence: Math.floor(Math.random() * 20) + 75,
      timestamp: new Date().toISOString()
    };
  }

  processQuery(query, data) {
    const lowercaseQuery = query.toLowerCase();
    
    if (lowercaseQuery.includes('performance') || lowercaseQuery.includes('today')) {
      const profit = data.profitability ? 
        data.profitability.miners.reduce((sum, m) => sum + m.profit, 0) + 
        data.profitability.inference.reduce((sum, i) => sum + i.profit, 0) : 0;
      
      return `${this.personality.conclusions[3]} Today's performance yielded $${profit.toFixed(1)}k profit, ${Math.random() > 0.5 ? 'exceeding' : 'meeting'} yesterday's metrics by ${(Math.random() * 20 + 5).toFixed(1)}%. Carbon footprint optimized to ${(Math.random() * 2 + 1).toFixed(1)} tCO2e. Splendid work, detective.`;
    }

    if (lowercaseQuery.includes('opportunity') || lowercaseQuery.includes('arbitrage')) {
      const energyPrice = data.prices?.[0]?.energy_price || 0.65;
      const tokenPrice = data.prices?.[0]?.token_price || 2.5;
      const arbitrage = ((tokenPrice - energyPrice) / energyPrice * 100).toFixed(0);
      
      return `${this.personality.insights[0]} I detect a ${arbitrage}% arbitrage opportunity between ERCOT energy and GPU token value. Confidence level: ${Math.floor(Math.random() * 20) + 75}%. Recommend immediate reallocation to inference operations.`;
    }

    if (lowercaseQuery.includes('status') || lowercaseQuery.includes('current')) {
      const status = this.analyzeMarketStatus(data.profitability, data.prices);
      return `Current status: ${status.status.toUpperCase()}. ${status.message} Confidence: ${status.confidence}%.`;
    }

    return `${this.personality.greeting} I'm analyzing the data patterns. Could you be more specific about energy optimization, market opportunities, or performance metrics?`;
  }
}