import axios from 'axios';
import { config } from '@/config/environment';

console.log('🔗 API URL configurada:', config.API_URL);
console.log('🌍 Modo:', config.isDevelopment ? 'Desarrollo' : 'Producción');

const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos timeout para Railway
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en API:', error);
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ No se puede conectar al backend. Verifica que esté corriendo.');
    } else if (error.code === 'ENOTFOUND') {
      console.error('❌ No se pudo resolver la URL del backend.');
    } else if (error.response?.status === 503) {
      console.error('❌ El backend está arrancando. Intenta en unos segundos.');
    }
    return Promise.reject(error);
  }
);

export const indicadoresApi = {
  // Obtener todos los indicadores
  getIndicadores: () => api.get('/indicadores'),
  
  // Obtener indicadores por área
  getIndicadoresByArea: (area) => api.get(`/indicadores/area/${area}`),
  
  // Obtener un indicador específico
  getIndicador: (id) => api.get(`/indicadores/${id}`),
  
  // Crear un nuevo indicador
  createIndicador: (data) => api.post('/indicadores', data),
  
  // Actualizar un indicador
  updateIndicador: (id, data) => api.put(`/indicadores/${id}`, data),
  
  // Eliminar un indicador
  deleteIndicador: (id) => api.delete(`/indicadores/${id}`),
  
  // Obtener estadísticas del dashboard
  getEstadisticas: () => api.get('/indicadores/estadisticas/dashboard'),
};

export default api; 