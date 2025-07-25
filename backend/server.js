const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
// Define backend URL for internal API calls
const BACKEND_URL = `http://localhost:${PORT}`;

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint to fetch prices from Mara Hackathon API
app.get('/api/prices', async (req, res) => {
  try {
    console.log('Fetching prices from Mara Hackathon API...');
    
    const response = await axios.get('https://mara-hackathon-api.onrender.com/prices');
    
    console.log('API Response received:');
    console.log('Status:', response.status);
    console.log('Data length:', response.data.length);
    console.log('First few records:');
    console.log(JSON.stringify(response.data.slice(0, 3), null, 2));
    
    res.json({
      success: true,
      data: response.data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching prices:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API endpoint to fetch inventory from Mara Hackathon API
app.get('/api/inventory', async (req, res) => {
  try {
    console.log('Fetching inventory from Mara Hackathon API...');
    
    const response = await axios.get('https://mara-hackathon-api.onrender.com/inventory');
    
    console.log('Inventory API Response received:');
    console.log('Status:', response.status);
    console.log('Inventory data:');
    console.log(JSON.stringify(response.data, null, 2));
    
    res.json({
      success: true,
      data: response.data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching inventory:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API endpoint to create a new site via Mara Hackathon API
app.post('/api/sites', async (req, res) => {
  try {
    console.log('Creating site via Mara Hackathon API...');
    console.log('Request body:', req.body);
    
    const response = await axios.post('https://mara-hackathon-api.onrender.com/sites', {
      name: req.body.name
    });
    
    console.log('Site creation API Response received:');
    console.log('Status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    res.json({
      success: true,
      data: response.data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error creating site:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API endpoint to fetch machines from Mara Hackathon API with API key
app.get('/api/machines', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'X-Api-Key header is required',
        timestamp: new Date().toISOString()
      });
    }
    
    console.log('Fetching machines from Mara Hackathon API...');
    console.log('Using API Key:', apiKey);
    
    const response = await axios.get('https://mara-hackathon-api.onrender.com/machines', {
      headers: {
        'X-Api-Key': apiKey
      }
    });
    
    console.log('Machines API Response received:');
    console.log('Status:', response.status);
    console.log('Machines data:');
    console.log(JSON.stringify(response.data, null, 2));
    
    res.json({
      success: true,
      data: response.data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching machines:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API endpoint to update machine allocation via Mara Hackathon API
app.put('/api/machines', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'X-Api-Key header is required',
        timestamp: new Date().toISOString()
      });
    }

    const allocation = req.body;
    console.log('Updating machine allocation via Mara Hackathon API...');
    console.log('Using API Key:', apiKey);
    console.log('Request body:', allocation);
    
    const response = await axios.put('https://mara-hackathon-api.onrender.com/machines', allocation, {
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Machine allocation API Response received:');
    console.log('Status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    res.json({
      success: true,
      data: response.data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error updating machine allocation:', error.message);
    if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        return res.status(error.response.status).json({
            success: false,
            error: error.response.data,
            timestamp: new Date().toISOString()
        });
    }
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.post('/api/test-analysis', async (req, res) => {
    // WARNING: Hardcoding API keys is insecure. In production, use environment variables.
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

    try {
        console.log('Proxying request to Anthropic API...');
        const response = await axios.post('https://api.anthropic.com/v1/messages', {
            model: "claude-opus-4-0",
            max_tokens: 1024,
            messages: [
                { role: "user", content: "Hello, world" }
            ]
        }, {
            headers: {
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
            }
        });

        console.log('Anthropic API Response received:');
        console.log('Status:', response.status);
        res.json({
            success: true,
            data: response.data,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error proxying to Anthropic API:', error.message);
        if (error.response) {
            console.error('Error response data:', error.response.data);
            return res.status(error.response.status).json({
                success: false,
                error: error.response.data
            });
        }
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Chat endpoint integrating with Claude AI
app.post('/api/chat', async (req, res) => {
  try {
    const { messages: userMessages, apiKey, siteName } = req.body;
    // Fetch latest external data via backend proxies
    const [pricesRes, inventoryRes, machinesRes] = await Promise.all([
      axios.get(`${BACKEND_URL}/api/prices`),
      axios.get(`${BACKEND_URL}/api/inventory`),
      axios.get(`${BACKEND_URL}/api/machines`, { headers: { 'X-Api-Key': apiKey }})
    ]);
    const prices = pricesRes.data.data;
    const inventory = inventoryRes.data.data;
    const machines = machinesRes.data.data;
    // Build system prompt with context and analysis tasks
    let prompt = `SYSTEM: You are Wattson AI for the MARA Hackathon API.<br/>
<br/>
<strong>Site:</strong> ${siteName}<br/>
<strong>Pricing (latest):</strong> Energy $${prices[0].energy_price.toFixed(3)}, Hash $${prices[0].hash_price.toFixed(3)}, Token $${prices[0].token_price.toFixed(3)}<br/>
<strong>Inventory:</strong> ASIC inference (power ${inventory.inference.asic.power}, tokens ${inventory.inference.asic.tokens}); GPU inference (power ${inventory.inference.gpu.power}, tokens ${inventory.inference.gpu.tokens})<br/>
<strong>Miners:</strong> air ${inventory.miners.air.hashrate} TH/s @ ${inventory.miners.air.power} W; hydro ${inventory.miners.hydro.hashrate} TH/s @ ${inventory.miners.hydro.power} W; immersion ${inventory.miners.immersion.hashrate} TH/s @ ${inventory.miners.immersion.power} W<br/>
<strong>Current Allocation:</strong> ASIC compute ${machines.asic_compute}, GPU compute ${machines.gpu_compute}, air miners ${machines.air_miners}, hydro miners ${machines.hydro_miners}, immersion miners ${machines.immersion_miners}<br/>
<strong>Power Used:</strong> ${machines.total_power_used} W; <strong>Total Revenue:</strong> $${machines.total_revenue}<br/>
<br/>
Use this context to:
<ul>
  <li><strong>Analyze</strong> current pricing trends and inventory levels</li>
  <li><strong>Assess</strong> operational performance and power efficiency</li>
  <li><strong>Recommend</strong> allocation or optimization strategies</li>
  <li><strong>Answer</strong> detailed questions about profitability, power usage, and resource availability</li>
</ul>
Now continue the conversation:
\n`;
    // Append conversation history
    userMessages.forEach(msg => {
      prompt += `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}\n`;
    });
    prompt += 'Assistant:';
    // Call Claude via Messages API
    const aiResp = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      system: prompt,
      messages: userMessages.map(m => ({ role: m.role, content: m.content }))
    }, {
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      }
    });
    const completion = aiResp.data.content.map(c => c.text).join('').trim();
    res.json({ success: true, completion });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    if (error.response) {
      return res.status(error.response.status).json({ success: false, error: error.response.data });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analysis endpoint for AI-powered analysis of global context
app.post('/api/analysis', async (req, res) => {
  try {
    const { globalContext, apiKey } = req.body;
    
    if (!globalContext) {
      return res.status(400).json({
        success: false,
        error: 'Global context is required',
        timestamp: new Date().toISOString()
      });
    }

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'API key is required',
        timestamp: new Date().toISOString()
      });
    }

    console.log('Performing AI analysis of global context...');
    console.log('API Key:', apiKey);
    console.log('Global context keys:', Object.keys(globalContext));

    // Create the analysis prompt
    const analysisPrompt = `Analyze the following data from the MARA Hackathon 2025 API documentation. Your response should include:

1. **Status**: A "Green", "Yellow", or "Red" indicator based on the profitability and current market conditions.
   * **Green**: Favorable prices and inventory for profitable operations.
   * **Yellow**: Some concerns, like fluctuating prices or limited inventory, warranting caution.
   * **Red**: Unfavorable prices, high costs, or severely limited inventory, indicating potential losses or major operational issues.

2. **Summary**: A concise summary of the current pricing trends (energy, hash, token) and available inventory (miners, inference machines), highlighting any significant changes or imbalances. Focus on the most recent price data provided.

3. **Actions**: A list of actionable recommendations based on the pricing and inventory information. Each action should include:
   * **Confidence**: A percentage (85-98%) indicating AI confidence in the recommendation
   * **Timeframe**: Estimated time for the action to take effect (1-8 hours)
   * **Profit Impact**: Estimated hourly profit increase/decrease in USD
   * **Carbon Impact**: Estimated change in carbon emissions (tCO2e)
   * **Wattson AI Insight**: A brief, insightful comment about the market conditions or strategy

These actions should aim to optimize revenue, minimize costs, and efficiently utilize available resources. Consider strategies like:
   * Adjusting allocations of different miner types (air, hydro, immersion).
   * Make sure the total number of miners is less than 50.
   * Adjusting allocations of different inference types (ASIC, GPU).
   * Prioritizing operations based on profitability.
   * Any other relevant strategic moves.

**Data to analyze:**

${JSON.stringify(globalContext, null, 2)}

Output Format:

{
  "status": "[[STATUS]]",
  "summary": "[[SUMMARY]]",
  "actions": [
    {
      "type": "api_call",
      "endpoint": "https://mara-hackathon-api.onrender.com/machines",
      "method": "PUT",
      "headers": {
        "X-Api-Key": "${apiKey}"
      },
      "body": {
        "asic_miners": "[[OPTIMAL_ASIC_MINERS]]",
        "gpu_compute": "[[OPTIMAL_GPU_COMPUTE]]",
        "asic_compute": "[[OPTIMAL_ASIC_COMPUTE]]",
        "immersion_miners": "[[OPTIMAL_IMMERSION_MINERS]]",
        "air_miners": "[[OPTIMAL_AIR_MINERS]]",
        "hydro_miners": "[[OPTIMAL_HYDRO_MINERS]]"
      },
      "description": "[[rationale]]",
      "confidence": "[[85-98]]%",
      "timeframe": "[[1-8]] hours",
      "profit_impact": "+$[[AMOUNT]]/hour",
      "carbon_impact": "[[+/-]] [[AMOUNT]] tCO2e",
      "wattson_insight": "[[INSIGHTFUL_COMMENT_ABOUT_MARKET_OR_STRATEGY]]"
    }
  ]
}

Please provide a valid JSON response with the exact format specified above. Calculate realistic values based on the data provided.`;

    // Call Anthropic API for analysis
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    
    if (!ANTHROPIC_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Anthropic API key not configured',
        timestamp: new Date().toISOString()
      });
    }

    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: "claude-sonnet-4-0",
      max_tokens: 2048,
      messages: [
        { 
          role: "user", 
          content: analysisPrompt
        }
      ]
    }, {
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      }
    });

    console.log('Anthropic API Response received:');
    console.log('Status:', response.status);
    
    // Parse the AI response
    const aiResponse = response.data.content[0].text;
    console.log('AI Response:', aiResponse);

    // Try to extract JSON from the response
    let analysisResult;
    try {
      // Look for JSON in the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Return a fallback response
      analysisResult = {
        status: "Yellow",
        summary: "Unable to parse AI analysis. Please check the data and try again.",
        actions: []
      };
    }

    res.json({
      success: true,
      data: analysisResult,
      rawResponse: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in analysis endpoint:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      return res.status(error.response.status).json({
        success: false,
        error: error.response.data,
        timestamp: new Date().toISOString()
      });
    }
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint to generate a detailed summary after an action is executed
app.post('/api/execution-summary', async (req, res) => {
  try {
    const { action, globalContext, apiKey } = req.body;

    if (!action || !globalContext || !apiKey) {
      return res.status(400).json({
        success: false,
        error: 'Action, global context, and API key are required',
      });
    }

    console.log('Generating execution summary...');

    const summaryPrompt = `
An action was just executed to optimize a cryptocurrency mining and AI inference operation.
Based on the executed action and the state of the system before the action, generate a detailed analysis of the execution.

**Executed Action:**
${JSON.stringify(action, null, 2)}

**System State Before Action:**
${JSON.stringify(globalContext, null, 2)}

Your task is to generate a JSON object that provides a detailed breakdown of the execution's outcome. The tone should be professional and data-driven.

The JSON object must have the following structure:
{
  "system_components_affected": [ "Component 1", "Component 2", "..." ],
  "performance_metrics": [
    { "metric": "Fleet Utilization", "value": "XX.X%", "comment": "(+X.X% improvement)" },
    { "metric": "Power Efficiency", "value": "XX.X%", "comment": "(optimal range)" },
    { "metric": "Network Latency", "value": "XXms", "comment": "(excellent)" },
    { "metric": "Profitability", "value": "+$XXXX/hr", "comment": "projected" }
  ],
  "next_recommended_actions": [
    "Monitor performance for 24 hours",
    "Review efficiency trends weekly",
    "Schedule maintenance in 30 days"
  ]
}

**Instructions for generating the content:**
1.  **system_components_affected**: Identify the main parts of the operation impacted by the change. Examples: "Mining Fleet", "Energy Management", "AI Inference". List 2-4 components.
2.  **performance_metrics**: Generate 3-4 key performance indicators that would logically be affected by the action.
    *   For each metric, provide a realistic "value" and a brief "comment".
    *   The values should reflect a positive outcome from the executed action. For example, if miners were re-allocated for profit, show an improvement in fleet utilization or profitability.
    *   Metrics can include: Fleet Utilization, Power Efficiency, Network Latency, Profitability, Hash Rate, etc.
3.  **next_recommended_actions**: Provide a list of 3 logical follow-up actions for an operator to take. These should be prudent operational steps.

Provide ONLY the raw JSON object in your response, without any surrounding text or markdown.
    `;

    // Call Anthropic API
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!ANTHROPIC_API_KEY) {
        return res.status(500).json({
            success: false,
            error: 'Anthropic API key not configured',
        });
    }

    const response = await axios.post('https://api.anthropic.com/v1/messages', {
        model: "claude-sonnet-4-0",
        max_tokens: 1024,
        messages: [{ role: "user", content: summaryPrompt }]
    }, {
        headers: {
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
        }
    });

    const aiResponse = response.data.content[0].text;
    console.log('AI Execution Summary Response:', aiResponse);

    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const summaryResult = JSON.parse(jsonMatch[0]);
      res.json({
        success: true,
        data: summaryResult,
      });
    } else {
      throw new Error('No JSON found in AI response for execution summary');
    }

  } catch (error) {
    console.error('Error in execution-summary endpoint:', error.message);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      return res.status(error.response.status).json({
        success: false,
        error: error.response.data,
      });
    }
    res.status(500).json({
        success: false,
        error: error.message,
    });
  }
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`Prices endpoint: http://localhost:${PORT}/api/prices`);
  console.log(`Inventory endpoint: http://localhost:${PORT}/api/inventory`);
  console.log(`Machines endpoint: GET http://localhost:${PORT}/api/machines`);
  console.log(`Manage Machines endpoint: PUT http://localhost:${PORT}/api/machines`);
  console.log(`Analysis endpoint: POST http://localhost:${PORT}/api/analysis`);
  console.log(`Execution Summary endpoint: POST http://localhost:${PORT}/api/execution-summary`);
}); 