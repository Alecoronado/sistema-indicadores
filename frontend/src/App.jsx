import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import NuevoIndicador from '@/pages/NuevoIndicador';
import ActualizarIndicador from '@/pages/ActualizarIndicador';
import HistorialIndicadores from '@/pages/HistorialIndicadores';
import GanttSyncfusion from '@/pages/GanttSyncfusion';
import Login from '@/pages/Login';
import Callback from '@/pages/Callback';
import { IndicadoresProvider } from '@/context/IndicadoresContext';

function App() {
  return (
    <IndicadoresProvider>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/nuevo-indicador" element={<NuevoIndicador />} />
          <Route path="/actualizar-indicador" element={<ActualizarIndicador />} />
          <Route path="/historial" element={<HistorialIndicadores />} />
          <Route path="/gantt" element={<GanttSyncfusion />} />
        </Routes>
      </Layout>
      <Toaster />
    </IndicadoresProvider>
  );
}

export default App;
