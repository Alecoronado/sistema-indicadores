import React from 'react';
import { useMsal } from '@azure/msal-react';
import { Button } from '@/components/ui/button';

const Login = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="glass-card p-8 rounded-lg shadow-lg flex flex-col items-center">
        <img src="https://cdn.worldvectorlogo.com/logos/microsoft-azure-2.svg" alt="Azure AD" className="h-16 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Iniciar sesión con Microsoft</h2>
        <Button onClick={handleLogin} className="w-full">Iniciar sesión con Azure AD</Button>
      </div>
    </div>
  );
};

export default Login; 