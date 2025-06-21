const express = require('express');
const axios = require('axios');
const cors = require('cors');

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
  console.log(`Machines endpoint: http://localhost:${PORT}/api/machines`);
}); 