// Script to test the connection with the backend from the terminal
// This file must be executed with node --experimental-json-modules src/scripts/testBackend.mjs
import { createRequire } from 'module';
import { AbortController } from 'node-abort-controller';
import fetch from 'node-fetch';

const require = createRequire(import.meta.url);
require('dotenv').config();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

async function testBackendConnection() {
  console.log(`\n🔍 Testing connection with the backend: ${API_URL}\n`);
  
  try {
    // Configure timeout of 5 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_URL}/`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Connection successful!');
      console.log(`📝 Server message: ${data.message || 'No message'}`);
      return true;
    } else {
      console.log(`❌ Connection error: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    let errorMessage = 'Unknown error';
    
    if (error.name === 'AbortError') {
      errorMessage = 'The connection took too long (timeout of 5 seconds)';
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Connection refused. Check if the server is running.';
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'Could not find the host. Check the backend URL.';
    } else {
      errorMessage = error.message;
    }
    
    console.log(`❌ Error: ${errorMessage}`);
    return false;
  }
}

// Auto-ejecutar el test
testBackendConnection()
  .then(success => {
    if (success) {
      console.log('\nBackend is running and connected.\n');
    } else {
      console.log('\n⚠️ Could not connect to the backend. Check if it is running.\n');
    }
  })
  .catch(error => {
    console.error('\nUnexpected error:', error, '\n');
  }); 