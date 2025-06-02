import React, { useState, useMemo } from 'react';
import { Calendar, Clock, Filter, BarChart3, Target } from 'lucide-react';
import { useIndicadores } from '@/context/IndicadoresContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GanttRealista = () => {
  const { indicadores, areas } = useIndicadores();
  const [areaSeleccionada, setAreaSeleccionada] = useState('Todas');
  const [indicadorSeleccionado, setIndicadorSeleccionado] = useState('Todos');

  // Filtrar indicadores
  const indicadoresFiltrados = useMemo(() => {
    let filtrados = indicadores || [];
    
    if (areaSeleccionada !== 'Todas') {
      filtrados = filtrados.filter(ind => ind.area === areaSeleccionada);
    }
    
    if (indicadorSeleccionado !== 'Todos') {
      filtrados = filtrados.filter(ind => ind.id === parseInt(indicadorSeleccionado));
    }
    
    return filtrados;
  }, [indicadores, areaSeleccionada, indicadorSeleccionado]);

  // Obtener lista de indicadores para el filtro
  const indicadoresParaFiltro = useMemo(() => {
    if (areaSeleccionada === 'Todas') {
      return indicadores || [];
    }
    return (indicadores || []).filter(ind => ind.area === areaSeleccionada);
  }, [indicadores, areaSeleccionada]);

  // Calcular rango de fechas del proyecto
  const rangoFechas = useMemo(() => {
    if (!indicadoresFiltrados.length) {
      const hoy = new Date();
      const futuro = new Date(hoy.getTime() + 30 * 24 * 60 * 60 * 1000);
      return { inicio: hoy, fin: futuro };
    }

    let fechaMin = new Date(indicadoresFiltrados[0].fechaInicioGeneral);
    let fechaMax = new Date(indicadoresFiltrados[0].fechaFinalizacionGeneral);

    indicadoresFiltrados.forEach(indicador => {
      const inicioInd = new Date(indicador.fechaInicioGeneral);
      const finInd = new Date(indicador.fechaFinalizacionGeneral);
      
      if (inicioInd < fechaMin) fechaMin = inicioInd;
      if (finInd > fechaMax) fechaMax = finInd;

      if (indicador.hitos) {
        indicador.hitos.forEach(hito => {
          const inicioHito = new Date(hito.fechaInicioHito);
          const finHito = new Date(hito.fechaFinalizacionHito);
          
          if (inicioHito < fechaMin) fechaMin = inicioHito;
          if (finHito > fechaMax) fechaMax = finHito;
        });
      }
    });

    return { inicio: fechaMin, fin: fechaMax };
  }, [indicadoresFiltrados]);

  // Funciones auxiliares
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

  const formatearFechaCorta = (fecha) => {
    if (!fecha) return 'N/A';
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short'
      });
    } catch {
      return 'N/A';
    }
  };

  const calcularPosicionBarra = (fechaInicio, fechaFin) => {
    const totalDias = (rangoFechas.fin - rangoFechas.inicio) / (1000 * 60 * 60 * 24);
    const diasDesdeInicio = (new Date(fechaInicio) - rangoFechas.inicio) / (1000 * 60 * 60 * 24);
    const duracion = (new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24);
    
    const left = Math.max(0, (diasDesdeInicio / totalDias) * 100);
    const width = Math.max(1, (duracion / totalDias) * 100);
    
    return { left: `${left}%`, width: `${width}%` };
  };

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'Completado': return 'bg-green-500';
      case 'En Proceso': return 'bg-blue-500';
      case 'Retrasado': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Calcular posición de la línea "hoy"
  const posicionHoy = () => {
    const totalDias = (rangoFechas.fin - rangoFechas.inicio) / (1000 * 60 * 60 * 24);
    const diasHastaHoy = (new Date() - rangoFechas.inicio) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.min(100, (diasHastaHoy / totalDias) * 100));
  };

  // Generar marcadores de tiempo
  const generarMarcadoresTiempo = () => {
    const marcadores = [];
    const totalDias = (rangoFechas.fin - rangoFechas.inicio) / (1000 * 60 * 60 * 24);
    const intervalo = Math.max(7, Math.floor(totalDias / 8)); // Al menos cada semana
    
    for (let i = 0; i <= totalDias; i += intervalo) {
      const fecha = new Date(rangoFechas.inicio.getTime() + i * 24 * 60 * 60 * 1000);
      const posicion = (i / totalDias) * 100;
      marcadores.push({ fecha, posicion });
    }
    
    return marcadores;
  };

  const marcadoresTiempo = generarMarcadoresTiempo();

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            Cronograma Gantt
          </h1>
          <p className="text-gray-600 mt-1">Visualización temporal profesional de indicadores</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          {/* Filtro por Área */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-5 w-5 text-gray-500" />
            <Select value={areaSeleccionada} onValueChange={(value) => {
              setAreaSeleccionada(value);
              setIndicadorSeleccionado('Todos'); // Reset indicador al cambiar área
            }}>
              <SelectTrigger className="w-full sm:w-[200px]">
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

          {/* Filtro por Indicador */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Target className="h-5 w-5 text-gray-500" />
            <Select value={indicadorSeleccionado} onValueChange={setIndicadorSeleccionado}>
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="Filtrar por Indicador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos los indicadores</SelectItem>
                {indicadoresParaFiltro.map(indicador => (
                  <SelectItem key={indicador.id} value={indicador.id.toString()}>
                    {indicador.nombreIndicador}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Indicadores</p>
              <p className="text-2xl font-bold text-blue-600">{indicadoresFiltrados.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Completados</p>
              <p className="text-2xl font-bold text-green-600">
                {indicadoresFiltrados.flatMap(ind => ind.hitos || [])
                  .filter(hito => hito.estadoHito === 'Completado').length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">En Proceso</p>
              <p className="text-2xl font-bold text-amber-600">
                {indicadoresFiltrados.flatMap(ind => ind.hitos || [])
                  .filter(hito => hito.estadoHito === 'En Proceso').length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Retrasados</p>
              <p className="text-2xl font-bold text-red-600">
                {indicadoresFiltrados.flatMap(ind => ind.hitos || [])
                  .filter(hito => hito.estadoHito === 'Retrasado').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gantt Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timeline del Proyecto ({formatearFecha(rangoFechas.inicio)} - {formatearFecha(rangoFechas.fin)})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {indicadoresFiltrados.length > 0 ? (
            <div className="space-y-6">
              {/* Escala de tiempo */}
              <div className="relative bg-gray-50 border rounded-lg p-4">
                <div className="relative h-12 mb-4">
                  {/* Marcadores de tiempo */}
                  <div className="absolute top-0 left-0 right-0 h-8 border-b border-gray-300">
                    {marcadoresTiempo.map((marcador, index) => (
                      <div
                        key={index}
                        className="absolute top-0 transform -translate-x-1/2"
                        style={{ left: `${marcador.posicion}%` }}
                      >
                        <div className="w-0.5 h-8 bg-gray-400"></div>
                        <div className="absolute top-9 left-1/2 transform -translate-x-1/2">
                          <span className="text-xs text-gray-600 whitespace-nowrap">
                            {formatearFechaCorta(marcador.fecha)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Línea de "hoy" */}
                  <div
                    className="absolute top-0 w-0.5 h-8 bg-red-500 z-10"
                    style={{ left: `${posicionHoy()}%` }}
                  >
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="absolute top-9 left-1/2 transform -translate-x-1/2">
                      <span className="text-xs text-red-600 font-semibold whitespace-nowrap">HOY</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Indicadores y sus hitos */}
              <div className="space-y-8">
                {indicadoresFiltrados.map((indicador, indIndex) => (
                  <div key={indicador.id} className="space-y-4">
                    {/* Indicador principal */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {indicador.nombreIndicador}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span>{indicador.vp}</span>
                            <span>•</span>
                            <span>{indicador.area}</span>
                            <span>•</span>
                            <span>{indicador.tipoIndicador}</span>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <p>{formatearFecha(indicador.fechaInicioGeneral)} - {formatearFecha(indicador.fechaFinalizacionGeneral)}</p>
                        </div>
                      </div>

                      {/* Barra de Gantt del indicador */}
                      <div className="relative h-6 bg-gray-200 rounded mb-2">
                        <div
                          className="absolute h-full bg-blue-500 rounded flex items-center px-2"
                          style={calcularPosicionBarra(indicador.fechaInicioGeneral, indicador.fechaFinalizacionGeneral)}
                        >
                          <span className="text-white text-xs font-medium truncate">
                            {indicador.nombreIndicador}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Hitos */}
                    {indicador.hitos && indicador.hitos.length > 0 && (
                      <div className="ml-8 space-y-3">
                        {indicador.hitos.map((hito, hitoIndex) => (
                          <div key={hitoIndex} className="border rounded-lg p-3 bg-white">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-800 flex items-center gap-2">
                                  <span className={`w-3 h-3 rounded-full ${obtenerColorEstado(hito.estadoHito)}`}></span>
                                  {hito.nombreHito}
                                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                    #{hito.ordenHito || hitoIndex + 1}
                                  </span>
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {hito.responsableHito} • {hito.avanceHito || 0}%
                                </p>
                              </div>
                              <div className="text-right">
                                <span className={`px-2 py-1 rounded-full text-xs text-white ${obtenerColorEstado(hito.estadoHito)}`}>
                                  {hito.estadoHito}
                                </span>
                              </div>
                            </div>

                            {/* Barra de Gantt del hito */}
                            <div className="relative h-4 bg-gray-200 rounded">
                              <div
                                className={`absolute h-full rounded ${obtenerColorEstado(hito.estadoHito)}`}
                                style={calcularPosicionBarra(hito.fechaInicioHito, hito.fechaFinalizacionHito)}
                              ></div>
                              {/* Barra de progreso dentro del hito */}
                              <div
                                className="absolute h-full bg-black bg-opacity-20 rounded"
                                style={{
                                  ...calcularPosicionBarra(hito.fechaInicioHito, hito.fechaFinalizacionHito),
                                  width: `${(parseFloat(calcularPosicionBarra(hito.fechaInicioHito, hito.fechaFinalizacionHito).width) * (hito.avanceHito || 0)) / 100}%`
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No hay datos para mostrar</h3>
              <p>Ajusta los filtros para ver indicadores.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GanttRealista; 