import React, { useState } from 'react';
import { Calendar, Clock, Filter, BarChart3 } from 'lucide-react';
import { useIndicadores } from '@/context/IndicadoresContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GanttMejorado = () => {
  const { indicadores, areas } = useIndicadores();
  const [areaSeleccionada, setAreaSeleccionada] = useState('Todas');

  // Filtrar indicadores por área
  const indicadoresFiltrados = areaSeleccionada === 'Todas' 
    ? indicadores || []
    : (indicadores || []).filter(ind => ind.area === areaSeleccionada);

  // Función para formatear fechas de manera simple
  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  // Función para obtener color según el estado
  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'Completado':
        return 'bg-green-500';
      case 'En Proceso':
        return 'bg-blue-500';
      case 'Retrasado':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Función para obtener color de fondo según el estado
  const obtenerColorFondoEstado = (estado) => {
    switch (estado) {
      case 'Completado':
        return 'bg-green-50 border-green-200';
      case 'En Proceso':
        return 'bg-blue-50 border-blue-200';
      case 'Retrasado':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            Cronograma Gantt
          </h1>
          <p className="text-gray-600 mt-1">Visualización temporal de indicadores y sus hitos</p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-5 w-5 text-gray-500" />
          <Select value={areaSeleccionada} onValueChange={setAreaSeleccionada}>
            <SelectTrigger className="w-full md:w-[200px]">
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

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Indicadores</p>
                <p className="text-2xl font-bold text-blue-600">{indicadoresFiltrados.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hitos Completados</p>
                <p className="text-2xl font-bold text-green-600">
                  {indicadoresFiltrados.flatMap(ind => ind.hitos || [])
                    .filter(hito => hito.estadoHito === 'Completado').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Proceso</p>
                <p className="text-2xl font-bold text-amber-600">
                  {indicadoresFiltrados.flatMap(ind => ind.hitos || [])
                    .filter(hito => hito.estadoHito === 'En Proceso').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Retrasados</p>
                <p className="text-2xl font-bold text-red-600">
                  {indicadoresFiltrados.flatMap(ind => ind.hitos || [])
                    .filter(hito => hito.estadoHito === 'Retrasado').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline visual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timeline de Proyectos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {indicadoresFiltrados.length > 0 ? (
              indicadoresFiltrados.map((indicador, index) => (
                <div key={indicador.id || index} className="space-y-4">
                  {/* Indicador principal */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {indicador.nombreIndicador}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            {indicador.vp}
                          </span>
                          <span>{indicador.area}</span>
                          <span>{indicador.tipoIndicador}</span>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p>Inicio: {formatearFecha(indicador.fechaInicioGeneral)}</p>
                        <p>Fin: {formatearFecha(indicador.fechaFinalizacionGeneral)}</p>
                      </div>
                    </div>

                    {/* Barra de progreso del indicador */}
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${indicador.hitos?.length > 0 
                            ? Math.round(indicador.hitos.reduce((sum, hito) => sum + (hito.avanceHito || 0), 0) / indicador.hitos.length)
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Progreso general: {indicador.hitos?.length > 0 
                        ? Math.round(indicador.hitos.reduce((sum, hito) => sum + (hito.avanceHito || 0), 0) / indicador.hitos.length)
                        : 0}%
                    </p>
                  </div>

                  {/* Hitos del indicador */}
                  {indicador.hitos && indicador.hitos.length > 0 && (
                    <div className="ml-8 space-y-3">
                      {indicador.hitos.map((hito, hitoIndex) => (
                        <div 
                          key={hitoIndex} 
                          className={`border rounded-lg p-4 ${obtenerColorFondoEstado(hito.estadoHito)}`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800 flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${obtenerColorEstado(hito.estadoHito)}`}></span>
                                {hito.nombreHito}
                                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                  Hito #{hito.ordenHito || hitoIndex + 1}
                                </span>
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Responsable: {hito.responsableHito}
                              </p>
                            </div>
                            <div className="text-right text-sm">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-1 rounded-full text-xs text-white ${obtenerColorEstado(hito.estadoHito)}`}>
                                  {hito.estadoHito}
                                </span>
                                <span className="font-bold text-lg">
                                  {hito.avanceHito || 0}%
                                </span>
                              </div>
                              <p className="text-gray-600">
                                {formatearFecha(hito.fechaInicioHito)} - {formatearFecha(hito.fechaFinalizacionHito)}
                              </p>
                            </div>
                          </div>

                          {/* Barra de progreso del hito */}
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${obtenerColorEstado(hito.estadoHito)}`}
                              style={{ width: `${hito.avanceHito || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No hay indicadores</h3>
                <p>No se encontraron indicadores para el área seleccionada.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GanttMejorado; 