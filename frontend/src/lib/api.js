// 🔧 SOLUCIÓN: NO usar rutas relativas, usar URLs completas con fallback
const getBaseUrl = () => {
  let apiUrl = import.meta.env.VITE_API_URL || process.env.VITE_API_URL;
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  // Check if VITE_API_URL is set and meaningful
  if (apiUrl && apiUrl !== 'VITE_API_URL' && !apiUrl.includes('VITE_API_URL')) {
    // If it is set and we are not on localhost, ensure it's HTTPS
    if (!isLocalhost && apiUrl.startsWith('http://')) {
      console.log('INFO: VITE_API_URL was http, converting to https for non-local environment.');
      apiUrl = apiUrl.replace('http://', 'https://');
    }
    return apiUrl;
  } else {
    // Fallback logic if VITE_API_URL is not set or is a placeholder
    if (isLocalhost) {
      return 'http://localhost:8000';
    } else {
      // Default to HTTPS for production if no VITE_API_URL is set
      return 'https://backend-indicadores-production.up.railway.app';
    }
  }
};

const baseUrl = getBaseUrl();

console.log('🔗 VITE_API_URL original:', import.meta.env.VITE_API_URL);
console.log('🔗 Base URL final:', baseUrl);
console.log('🌍 Modo:', import.meta.env.DEV ? 'Desarrollo' : 'Producción');

export const indicadoresApi = {
  // ✅ Obtener todos los indicadores - URL COMPLETA
  getIndicadores: async () => {
    const url = `${baseUrl}/api/indicadores`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return { data: await response.json() };
  },
  
  // ✅ Obtener indicadores por área - URL COMPLETA
  getIndicadoresByArea: async (area) => {
    const url = `${baseUrl}/api/indicadores/area/${area}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return { data: await response.json() };
  },
  
  // ✅ Obtener un indicador específico - URL COMPLETA
  getIndicador: async (id) => {
    const url = `${baseUrl}/api/indicadores/${id}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return { data: await response.json() };
  },
  
  // ✅ Crear un nuevo indicador - URL COMPLETA
  createIndicador: async (data) => {
    const url = `${baseUrl}/api/indicadores`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return { data: await response.json() };
  },
  
  // ✅ Actualizar un indicador - URL COMPLETA
  updateIndicador: async (id, data) => {
    const url = `${baseUrl}/api/indicadores/${id}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return { data: await response.json() };
  },
  
  // ✅ Eliminar un indicador - URL COMPLETA
  deleteIndicador: async (id) => {
    const url = `${baseUrl}/api/indicadores/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return { data: await response.json() };
  },
  
  // ✅ Obtener estadísticas del dashboard - URL COMPLETA
  getEstadisticas: async () => {
    const url = `${baseUrl}/api/indicadores/estadisticas/dashboard`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return { data: await response.json() };
  },
};

// Ya no necesitamos axios, usamos fetch con URLs completas
export default indicadoresApi; 