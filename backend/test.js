const axios = require('axios');

async function testMaraAPI() {
  try {
    console.log('Testing Mara Hackathon API directly...');
    console.log('URL: https://mara-hackathon-api.onrender.com/prices');
    console.log('---');
    
    const response = await axios.get('https://mara-hackathon-api.onrender.com/prices');
    
    console.log('✅ API call successful!');
    console.log('Status:', response.status);
    console.log('Data length:', response.data.length);
    console.log('---');
    
    console.log('📊 Sample data (first 3 records):');
    console.log(JSON.stringify(response.data.slice(0, 3), null, 2));
    console.log('---');
    
    console.log('📈 Price ranges:');
    const hashPrices = response.data.map(item => item.hash_price);
    const tokenPrices = response.data.map(item => item.token_price);
    const energyPrices = response.data.map(item => item.energy_price);
    
    console.log(`Hash Price: ${Math.min(...hashPrices).toFixed(2)} - ${Math.max(...hashPrices).toFixed(2)}`);
    console.log(`Token Price: ${Math.min(...tokenPrices).toFixed(2)} - ${Math.max(...tokenPrices).toFixed(2)}`);
    console.log(`Energy Price: ${Math.min(...energyPrices).toFixed(2)} - ${Math.max(...energyPrices).toFixed(2)}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testMaraAPI(); 