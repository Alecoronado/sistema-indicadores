import React, { useState, useEffect } from 'react';

const TestAPI = () => {
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'https://backend-indicadores-production.up.railway.app/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🧪 TEST - Iniciando petición al API...');
        const response = await fetch(`${API_URL}/indicadores`);
        
        console.log('🧪 TEST - Response status:', response.status);
        console.log('🧪 TEST - Response ok:', response.ok);
        console.log('🧪 TEST - Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('🧪 TEST - Datos recibidos:', data);
        console.log('🧪 TEST - Tipo:', typeof data);
        console.log('🧪 TEST - Es array:', Array.isArray(data));
        console.log('🧪 TEST - Longitud:', data?.length);
        
        if (Array.isArray(data) && data.length > 0) {
          console.log('🧪 TEST - Primer elemento:', data[0]);
          console.log('🧪 TEST - Propiedades primer elemento:', Object.keys(data[0]));
        }
        
        setDatos(data);
      } catch (err) {
        console.error('🧪 TEST - Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">🧪 Cargando datos de prueba...</div>;
  if (error) return <div className="p-4 bg-red-100 border border-red-300 rounded">🧪 Error: {error}</div>;

  return (
    <div className="p-4 bg-blue-100 border border-blue-300 rounded">
      <h3 className="font-bold mb-2">🧪 Test API - Datos recibidos:</h3>
      <p><strong>Tipo:</strong> {typeof datos}</p>
      <p><strong>Es array:</strong> {Array.isArray(datos) ? 'Sí' : 'No'}</p>
      <p><strong>Longitud:</strong> {datos?.length || 'N/A'}</p>
      <details className="mt-2">
        <summary className="cursor-pointer font-semibold">Ver datos JSON (click para expandir)</summary>
        <pre className="mt-2 p-2 bg-gray-800 text-green-400 rounded text-xs overflow-auto max-h-60">
          {JSON.stringify(datos, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default TestAPI; 