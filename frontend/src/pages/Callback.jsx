import React, { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Procesar el callback de Azure AD
        await instance.handleRedirectPromise();
        console.log('✅ Login exitoso, redirigiendo al dashboard...');
        // Redirigir al dashboard después del login exitoso
        navigate('/', { replace: true });
      } catch (error) {
        console.error('❌ Error en callback:', error);
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [instance, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-lg">Procesando autenticación...</p>
      </div>
    </div>
  );
};

export default Callback; 