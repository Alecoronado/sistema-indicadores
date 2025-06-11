// Configuración de entornos

export const config = {
  // URL base del backend según el entorno
  BASE_URL: import.meta.env.VITE_API_URL || getDefaultBaseUrl(),
  
  // URL completa de la API (base + /api)
  API_URL: (import.meta.env.VITE_API_URL || getDefaultBaseUrl()) + '/api',
  
  // Modo de desarrollo
  isDevelopment: import.meta.env.DEV,
  
  // Modo de producción
  isProduction: import.meta.env.PROD,
};

function getDefaultBaseUrl() {
  // Si estás corriendo en desarrollo local, usar localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  
  // Si estás en producción, SIEMPRE usar HTTPS
  return 'https://backend-indicadores-production.up.railway.app';
}

// URL de Railway para uso directo  
export const RAILWAY_BASE_URL = 'https://backend-indicadores-production.up.railway.app';
export const RAILWAY_API_URL = 'https://backend-indicadores-production.up.railway.app/api';

console.log('🌍 Entorno:', config.isDevelopment ? 'Desarrollo' : 'Producción');
console.log('🔗 Base URL:', config.BASE_URL);
console.log('🔗 API URL:', config.API_URL);
console.log('🔑 VITE_API_URL variable:', import.meta.env.VITE_API_URL);
console.log('🌐 Hostname:', window.location.hostname); 