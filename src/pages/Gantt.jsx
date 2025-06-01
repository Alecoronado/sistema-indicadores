import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, TrendingRight, Filter } from 'lucide-react';
import { useIndicadores } from '@/context/IndicadoresContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Gantt = () => {
  const { indicadores, areas } = useIndicadores();
  const [areaSeleccionada, setAreaSeleccionada] = useState('Todas');
  const [indicadoresFiltrados, setIndicadoresFiltrados] = useState([]);

  useEffect(() => {
    if (areaSeleccionada === 'Todas') {
      setIndicadoresFiltrados(indicadores || []);
    } else {
      setIndicadoresFiltrados((indicadores || []).filter(ind => ind.area === areaSeleccionada));
    }
  }, [areaSeleccionada, indicadores]);

  // Funciones auxiliares para fechas (sin date-fns por ahora)
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateShort = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const getDaysDifference = (date1, date2) => {
    const diffTime = Math.abs(new Date(date2) - new Date(date1));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Función para calcular el ancho de las barras y posición en la línea de tiempo
  const calcularDimensionesGantt = (fechaInicio, fechaFin, fechaInicioProyecto, fechaFinProyecto) => {
    const totalDias = getDaysDifference(fechaFinProyecto, fechaInicioProyecto);
    const diasDesdeInicio = getDaysDifference(fechaInicio, fechaInicioProyecto);
    const duracionTarea = getDaysDifference(fechaFin, fechaInicio);
    
    const left = Math.max(0, (diasDesdeInicio / totalDias) * 100);
    const width = Math.max(1, (duracionTarea / totalDias) * 100);
    
    return { left: `${left}%`, width: `${width}%` };
  };

  // Obtener fechas mínimas y máximas para el rango del proyecto
  const obtenerRangoFechas = () => {
    if (!indicadoresFiltrados.length) {
      const hoy = new Date();
      const futuro = new Date();
      futuro.setDate(hoy.getDate() + 30);
      return { inicio: hoy, fin: futuro };
    }
    
    let fechaMinima = new Date(indicadoresFiltrados[0]?.fechaInicioGeneral);
    let fechaMaxima = new Date(indicadoresFiltrados[0]?.fechaFinalizacionGeneral);
    
    indicadoresFiltrados.forEach(indicador => {
      const inicioInd = new Date(indicador.fechaInicioGeneral);
      const finInd = new Date(indicador.fechaFinalizacionGeneral);
      
      if (inicioInd < fechaMinima) fechaMinima = inicioInd;
      if (finInd > fechaMaxima) fechaMaxima = finInd;
      
      indicador.hitos?.forEach(hito => {
        const inicioHito = new Date(hito.fechaInicioHito);
        const finHito = new Date(hito.fechaFinalizacionHito);
        
        if (inicioHito < fechaMinima) fechaMinima = inicioHito;
        if (finHito > fechaMaxima) fechaMaxima = finHito;
      });
    });
    
    return { inicio: fechaMinima, fin: fechaMaxima };
  };

  const { inicio: fechaInicioProyecto, fin: fechaFinProyecto } = obtenerRangoFechas();
  const fechaHoy = new Date();

  // Calcular la posición de la línea de "hoy"
  const posicionHoy = () => {
    const totalDias = getDaysDifference(fechaFinProyecto, fechaInicioProyecto);
    const diasHastaHoy = getDaysDifference(fechaHoy, fechaInicioProyecto);
    return Math.max(0, Math.min(100, (diasHastaHoy / totalDias) * 100));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Cronograma Gantt</h1>
          <p className="text-gray-600 mt-1">Visualización temporal de indicadores y sus hitos</p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-5 w-5 text-gray-500" />
          <Select value={areaSeleccionada} onValueChange={setAreaSeleccionada}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filtrar por Área" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todas las áreas</SelectItem>
              {(areas || []).map(area => (
                <SelectItem key={area} value={area}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Línea de tiempo header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Línea de Tiempo - {formatDate(fechaInicioProyecto)} al {formatDate(fechaFinProyecto)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gray-50 rounded-lg p-4 min-h-[500px]">
            {/* Header con fechas */}
            <div className="flex justify-between text-sm text-gray-600 mb-6 border-b pb-2">
              <span>{formatDateShort(fechaInicioProyecto)}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Hoy: {formatDateShort(fechaHoy)}
              </span>
              <span>{formatDateShort(fechaFinProyecto)}</span>
            </div>

            {/* Línea de "hoy" */}
            <div 
              className="absolute top-16 bottom-4 w-0.5 bg-red-500 z-10"
              style={{ left: `${posicionHoy()}%` }}
            >
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 rounded-full"></div>
            </div>

            {/* Indicadores y Hitos */}
            <div className="space-y-6">
              {indicadoresFiltrados.map((indicador, indexIndicador) => (
                <div key={indicador.id} className="space-y-3">
                  {/* Barra del Indicador */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800 text-sm">
                        {indicador.nombreIndicador} ({indicador.vp})
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatDateShort(indicador.fechaInicioGeneral)} - {formatDateShort(indicador.fechaFinalizacionGeneral)}
                      </span>
                    </div>
                    
                    <div className="relative h-8 bg-gray-200 rounded">
                      <div 
                        className="absolute h-full bg-blue-500 rounded flex items-center px-2"
                        style={calcularDimensionesGantt(
                          indicador.fechaInicioGeneral,
                          indicador.fechaFinalizacionGeneral,
                          fechaInicioProyecto,
                          fechaFinProyecto
                        )}
                      >
                        <span className="text-white text-xs font-medium truncate">
                          {indicador.nombreIndicador}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hitos del Indicador */}
                  <div className="ml-6 space-y-2">
                    {(indicador.hitos || []).map((hito, indexHito) => (
                      <div key={hito.id || indexHito} className="relative">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">
                            📍 {hito.nombreHito}
                          </span>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-500">
                              {formatDateShort(hito.fechaInicioHito)} - {formatDateShort(hito.fechaFinalizacionHito)}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              hito.estadoHito === 'Completado' ? 'bg-green-100 text-green-800' :
                              hito.estadoHito === 'En Proceso' ? 'bg-blue-100 text-blue-800' :
                              hito.estadoHito === 'Retrasado' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {hito.avanceHito}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="relative h-4 bg-gray-200 rounded">
                          <div 
                            className={`absolute h-full rounded ${
                              hito.estadoHito === 'Completado' ? 'bg-green-400' :
                              hito.estadoHito === 'En Proceso' ? 'bg-blue-400' :
                              hito.estadoHito === 'Retrasado' ? 'bg-red-400' :
                              'bg-gray-400'
                            }`}
                            style={calcularDimensionesGantt(
                              hito.fechaInicioHito,
                              hito.fechaFinalizacionHito,
                              fechaInicioProyecto,
                              fechaFinProyecto
                            )}
                          >
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {indicadoresFiltrados.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay indicadores para mostrar en el área seleccionada.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado actual de los hitos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingRight className="h-5 w-5" />
            Estado Actual de Hitos al {formatDate(fechaHoy)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {indicadoresFiltrados.flatMap(indicador => 
              (indicador.hitos || []).map(hito => (
                <div key={`${indicador.id}-${hito.id}`} className="p-4 border rounded-lg bg-gray-50">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-800">{hito.nombreHito}</h4>
                    <p className="text-xs text-gray-600">{indicador.nombreIndicador}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        hito.estadoHito === 'Completado' ? 'bg-green-100 text-green-800' :
                        hito.estadoHito === 'En Proceso' ? 'bg-blue-100 text-blue-800' :
                        hito.estadoHito === 'Retrasado' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {hito.estadoHito}
                      </span>
                      <span className="text-sm font-bold text-blue-600">{hito.avanceHito}%</span>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      <p>Responsable: {hito.responsableHito}</p>
                      <p>Período: {formatDateShort(hito.fechaInicioHito)} - {formatDateShort(hito.fechaFinalizacionHito)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Gantt; 