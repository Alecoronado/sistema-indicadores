import axios from 'axios';

// Configuración de la URL de la API
// Forzar uso de Railway para pruebas
const API_URL = 'https://sistema-indicadores-production.up.railway.app/api';

console.log('🔗 API URL configurada:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en API:', error);
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ No se puede conectar al backend. Verifica que esté corriendo.');
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