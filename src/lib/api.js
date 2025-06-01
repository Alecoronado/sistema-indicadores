import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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