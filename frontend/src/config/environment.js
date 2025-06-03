// Configuración de entornos

export const config = {
  // URL del backend según el entorno
  API_URL: import.meta.env.VITE_API_URL || getDefaultApiUrl(),
  
  // Modo de desarrollo
  isDevelopment: import.meta.env.DEV,
  
  // Modo de producción
  isProduction: import.meta.env.PROD,
};

function getDefaultApiUrl() {
  // Si estás corriendo en desarrollo local, usar localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000/api';
  }
  
  // Si estás en producción, usar la URL de Railway
  return 'https://backend-indicadores-production.up.railway.app/api';
}

// URL de Railway para uso directo
export const RAILWAY_API_URL = 'https://backend-indicadores-production.up.railway.app/api';

console.log('🌍 Entorno:', config.isDevelopment ? 'Desarrollo' : 'Producción');
console.log('🔗 API URL:', config.API_URL); 