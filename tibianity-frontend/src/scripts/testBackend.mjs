// Script para probar la conexión con el backend desde la terminal
// Este archivo debe ser ejecutado con node --experimental-json-modules src/scripts/testBackend.mjs
import { createRequire } from 'module';
import { AbortController } from 'node-abort-controller';
import fetch from 'node-fetch';

const require = createRequire(import.meta.url);
require('dotenv').config();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

async function testBackendConnection() {
  console.log(`\n🔍 Probando conexión con el backend: ${API_URL}\n`);
  
  try {
    // Configurar timeout de 5 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_URL}/`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Conexión exitosa!');
      console.log(`📝 Mensaje del servidor: ${data.message || 'No hay mensaje'}`);
      return true;
    } else {
      console.log(`❌ Error de conexión: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    let errorMessage = 'Error desconocido';
    
    if (error.name === 'AbortError') {
      errorMessage = 'La conexión tardó demasiado tiempo (timeout de 5 segundos)';
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Conexión rechazada. Verifica que el servidor esté ejecutándose.';
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'No se pudo encontrar el host. Verifica la URL del backend.';
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
      console.log('\n✨ El backend está funcionando correctamente.\n');
    } else {
      console.log('\n⚠️ No se pudo conectar al backend. Verifica que esté en ejecución.\n');
    }
  })
  .catch(error => {
    console.error('\n💥 Error inesperado:', error, '\n');
  }); 