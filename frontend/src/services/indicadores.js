// 🎯 VERSIÓN DIRECTA - Usando mejores prácticas recomendadas
const baseUrl = import.meta.env.VITE_API_URL;

console.log('🔗 Base URL desde VITE_API_URL:', baseUrl);

export const getIndicadores = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/indicadores`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('❌ Error fetching indicadores:', error);
    throw error;
  }
};

export const getIndicador = async (id) => {
  try {
    const response = await fetch(`${baseUrl}/api/indicadores/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('❌ Error fetching indicador:', error);
    throw error;
  }
};

export const createIndicador = async (data) => {
  try {
    const response = await fetch(`${baseUrl}/api/indicadores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('❌ Error creating indicador:', error);
    throw error;
  }
};

export const updateIndicador = async (id, data) => {
  try {
    const response = await fetch(`${baseUrl}/api/indicadores/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('❌ Error updating indicador:', error);
    throw error;
  }
}; 