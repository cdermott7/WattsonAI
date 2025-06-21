const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

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
            model: "claude-3-opus-20240229",
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
    const { messages: userMessages, apiKey, siteName } = req.body; // extract credentials
    // System prompt with explicit tool instructions and argument schemas
    let prompt = `SYSTEM: You are Wattson AI for the MARA Hackathon API. Only discuss energy, hash, and machine allocation topics related to your site. The backend will automatically use your saved API key.
Available tools:
1) get_prices(): GET /prices (no arguments)
2) get_inventory(): GET /inventory (no arguments)
3) get_machines(): GET /machines (no user args; your API key is injected)
4) set_allocation(): PUT /machines
   - Provide args: {"air_miners": number, "hydro_miners": number, "immersion_miners": number, "asic_compute": number, "gpu_compute": number}
   (API key is injected automatically)
When invoking a tool, return ONLY a JSON object, for example:
  {"tool":"set_allocation","args":{"gpu_compute":5,"immersion_miners":3}}
After the tool runs and you receive its result, format the output as Markdown bullet points or a table for readability, then continue your response normally prefixed by "Assistant:".
For regular conversation, respond normally without JSON.
\n`;
    // Append conversation
    userMessages.forEach(msg => {
      prompt += `\n\n${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`;
    });
    prompt += '\n\nAssistant:';

    // Call Claude
    const response = await axios.post('https://api.anthropic.com/v1/complete', {
      model: 'claude-2',
      prompt,
      max_tokens_to_sample: 300,
      temperature: 0.7,
    }, {
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'Anthropic-Version': '2023-06-01',
        'Content-Type': 'application/json'
      }
    });

    let completion = response.data.completion.trim();
    // Detect tool call
    let toolResult;
    try {
      const toolCall = JSON.parse(completion);
      switch (toolCall.tool) {
        case 'get_prices':
          toolResult = await axios.get('https://mara-hackathon-api.onrender.com/prices');
          break;
        case 'get_inventory':
          toolResult = await axios.get('https://mara-hackathon-api.onrender.com/inventory');
          break;
        case 'get_machines':
          toolResult = await axios.get('https://mara-hackathon-api.onrender.com/machines', { headers: { 'X-Api-Key': apiKey }});
          break;
        case 'set_allocation':
          toolResult = await axios.put('https://mara-hackathon-api.onrender.com/machines', toolCall.args, { headers: { 'X-Api-Key': apiKey }});
          break;
        default:
          throw new Error(`Unknown tool: ${toolCall.tool}`);
      }
      // Re-prompt Claude with tool result
      const followupPrompt = prompt + `\n\nToolResponse: ${JSON.stringify(toolResult.data)}` + '\n\nAssistant:';
      const followup = await axios.post('https://api.anthropic.com/v1/complete', {
        model: 'claude-2',
        prompt: followupPrompt,
        max_tokens_to_sample: 300,
        temperature: 0.7,
      }, {
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'Anthropic-Version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      });
      completion = followup.data.completion;
    } catch (e) {
      // Not a tool call or error in tool; proceed with original completion
    }
    res.json({ success: true, completion });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    if (error.response) {
      console.error('Downstream error data:', error.response.data);
      return res.status(error.response.status).json({
        success: false,
        error: error.response.data
      });
    }
    res.status(500).json({ success: false, error: error.message });
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
}); 