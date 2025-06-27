import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import NuevoIndicador from '@/pages/NuevoIndicador';
import ActualizarIndicador from '@/pages/ActualizarIndicador';
import HistorialIndicadores from '@/pages/HistorialIndicadores';
import GanttSyncfusion from '@/pages/GanttSyncfusion';
import Login from '@/pages/Login';
import { IndicadoresProvider } from '@/context/IndicadoresContext';
import { useIsAuthenticated } from '@azure/msal-react';

function RequireAuth({ children }) {
  const isAuthenticated = useIsAuthenticated();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <IndicadoresProvider>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/nuevo-indicador" element={<RequireAuth><NuevoIndicador /></RequireAuth>} />
          <Route path="/actualizar-indicador" element={<RequireAuth><ActualizarIndicador /></RequireAuth>} />
          <Route path="/historial" element={<RequireAuth><HistorialIndicadores /></RequireAuth>} />
          <Route path="/gantt" element={<RequireAuth><GanttSyncfusion /></RequireAuth>} />
        </Routes>
      </Layout>
      <Toaster />
    </IndicadoresProvider>
  );
}

export default App;
