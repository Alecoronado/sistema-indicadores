// 🔧 SOLUCIÓN: NO usar rutas relativas, usar URLs completas
const baseUrl = import.meta.env.VITE_API_URL;

console.log('🔗 VITE_API_URL:', baseUrl);
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