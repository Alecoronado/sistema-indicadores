import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const Login = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleAzureLogin = () => {
    instance.loginRedirect();
  };

  const handleTraditionalLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Crear FormData para OAuth2PasswordRequestForm
      const formDataRequest = new FormData();
      formDataRequest.append('username', formData.email);
      formDataRequest.append('password', formData.password);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: formDataRequest,
      });

      if (response.ok) {
        const data = await response.json();
        // Guardar token en localStorage
        localStorage.setItem('access_token', data.access_token);
        toast({
          title: "Login exitoso",
          description: "Bienvenido al sistema",
        });
        navigate('/');
      } else {
        const error = await response.json();
        toast({
          title: "Error de autenticación",
          description: error.detail || "Credenciales inválidas",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Login Tradicional */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTraditionalLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="usuario@empresa.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Divisor */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gray-50 px-2 text-muted-foreground">
              O continúa con
            </span>
          </div>
        </div>

        {/* Login con Azure AD */}
        <Card>
          <CardContent className="pt-6">
            <Button 
              onClick={handleAzureLogin} 
              variant="outline" 
              className="w-full"
            >
              <img 
                src="https://cdn.worldvectorlogo.com/logos/microsoft-azure-2.svg" 
                alt="Azure AD" 
                className="h-5 w-5 mr-2" 
              />
              Iniciar sesión con Microsoft
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login; 