const axios = require('axios');

async function testMaraAPI() {
  try {
    console.log('Testing Mara Hackathon API directly...');
    console.log('---');
    
    // Test prices endpoint
    console.log('📊 Testing Prices API...');
    console.log('URL: https://mara-hackathon-api.onrender.com/prices');
    
    const pricesResponse = await axios.get('https://mara-hackathon-api.onrender.com/prices');
    
    console.log('✅ Prices API call successful!');
    console.log('Status:', pricesResponse.status);
    console.log('Data length:', pricesResponse.data.length);
    console.log('Sample data (first 3 records):');
    console.log(JSON.stringify(pricesResponse.data.slice(0, 3), null, 2));
    
    console.log('📈 Price ranges:');
    const hashPrices = pricesResponse.data.map(item => item.hash_price);
    const tokenPrices = pricesResponse.data.map(item => item.token_price);
    const energyPrices = pricesResponse.data.map(item => item.energy_price);
    
    console.log(`Hash Price: ${Math.min(...hashPrices).toFixed(2)} - ${Math.max(...hashPrices).toFixed(2)}`);
    console.log(`Token Price: ${Math.min(...tokenPrices).toFixed(2)} - ${Math.max(...tokenPrices).toFixed(2)}`);
    console.log(`Energy Price: ${Math.min(...energyPrices).toFixed(2)} - ${Math.max(...energyPrices).toFixed(2)}`);
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test inventory endpoint
    console.log('🏭 Testing Inventory API...');
    console.log('URL: https://mara-hackathon-api.onrender.com/inventory');
    
    const inventoryResponse = await axios.get('https://mara-hackathon-api.onrender.com/inventory');
    
    console.log('✅ Inventory API call successful!');
    console.log('Status:', inventoryResponse.status);
    console.log('Inventory data:');
    console.log(JSON.stringify(inventoryResponse.data, null, 2));
    
    // Analyze inventory data
    console.log('\n📋 Inventory Summary:');
    const { inference, miners } = inventoryResponse.data;
    
    console.log('🤖 Inference Hardware:');
    console.log(`  ASIC: ${inference.asic.power}W power, ${inference.asic.tokens} tokens`);
    console.log(`  GPU: ${inference.gpu.power}W power, ${inference.gpu.tokens} tokens`);
    
    console.log('⛏️  Mining Hardware:');
    console.log(`  Air: ${miners.air.hashrate} hashrate, ${miners.air.power}W power`);
    console.log(`  Hydro: ${miners.hydro.hashrate} hashrate, ${miners.hydro.power}W power`);
    console.log(`  Immersion: ${miners.immersion.hashrate} hashrate, ${miners.immersion.power}W power`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testMaraAPI(); 