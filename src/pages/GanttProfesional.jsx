import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Filter, Target, BarChart3 } from 'lucide-react';
import { useIndicadores } from '@/context/IndicadoresContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const GanttProfesional = () => {
  const { indicadores, vps, areas } = useIndicadores();
  
  // Estados para filtros jerárquicos: VP → Área → Indicador
  const [vpFiltro, setVpFiltro] = useState('');
  const [areaFiltro, setAreaFiltro] = useState('');
  const [indicadorFiltro, setIndicadorFiltro] = useState('');

  // Obtener áreas disponibles según VP seleccionado
  const areasDisponibles = useMemo(() => {
    if (!vpFiltro) return [];
    return [...new Set(indicadores.filter(ind => ind.vp === vpFiltro).map(ind => ind.area))];
  }, [vpFiltro, indicadores]);

  // Obtener indicadores disponibles según VP y Área seleccionados
  const indicadoresDisponibles = useMemo(() => {
    if (!vpFiltro || !areaFiltro) return [];
    return indicadores.filter(ind => ind.vp === vpFiltro && ind.area === areaFiltro);
  }, [vpFiltro, areaFiltro, indicadores]);

  // Obtener el indicador seleccionado
  const indicadorSeleccionado = useMemo(() => {
    if (!indicadorFiltro) return null;
    return indicadores.find(ind => ind.id === indicadorFiltro);
  }, [indicadorFiltro, indicadores]);

  // Verificar si hay filtros suficientes para mostrar el Gantt
  const puedesMostrarGantt = vpFiltro && areaFiltro && indicadorFiltro && indicadorSeleccionado;

  // Limpiar filtros dependientes cuando cambia un filtro padre
  useEffect(() => {
    if (vpFiltro && areaFiltro && !areasDisponibles.includes(areaFiltro)) {
      setAreaFiltro('');
    }
  }, [vpFiltro, areaFiltro, areasDisponibles]);

  useEffect(() => {
    if (areaFiltro && indicadorFiltro && !indicadoresDisponibles.find(ind => ind.id === indicadorFiltro)) {
      setIndicadorFiltro('');
    }
  }, [areaFiltro, indicadorFiltro, indicadoresDisponibles]);

  // Obtener lista de estados únicos con colores
  const estadosConColores = useMemo(() => {
    if (!indicadorSeleccionado?.hitos) return [];
    
    const estados = [...new Set(indicadorSeleccionado.hitos.map(hito => hito.estadoHito))];
    const coloresEstado = {
      'Completado': 'bg-green-500',
      'En Progreso': 'bg-blue-500', 
      'Por Comenzar': 'bg-gray-500'
    };
    
    return estados.map(estado => ({
      nombre: estado,
      color: coloresEstado[estado] || 'bg-gray-400'
    }));
  }, [indicadorSeleccionado]);

  // Obtener lista de responsables para referencia (sin colores específicos)
  const responsables = useMemo(() => {
    if (!indicadorSeleccionado?.hitos) return [];
    return [...new Set(indicadorSeleccionado.hitos.map(hito => hito.responsableHito))];
  }, [indicadorSeleccionado]);

  // Calcular rango de fechas y generar escala de meses
  const { rangoFechas, escalaMeses } = useMemo(() => {
    if (!indicadorSeleccionado?.hitos) {
      return { rangoFechas: { inicio: new Date(), fin: new Date() }, escalaMeses: [] };
    }

    let fechaMin = new Date(indicadorSeleccionado.fechaInicioGeneral);
    let fechaMax = new Date(indicadorSeleccionado.fechaFinalizacionGeneral);

    indicadorSeleccionado.hitos.forEach(hito => {
      const inicioHito = new Date(hito.fechaInicioHito);
      const finHito = new Date(hito.fechaFinalizacionHito);
      
      if (inicioHito < fechaMin) fechaMin = inicioHito;
      if (finHito > fechaMax) fechaMax = finHito;
    });

    // Generar escala de meses
    const meses = [];
    const fechaActual = new Date(fechaMin.getFullYear(), fechaMin.getMonth(), 1);
    const fechaFinal = new Date(fechaMax.getFullYear(), fechaMax.getMonth(), 1);
    
    while (fechaActual <= fechaFinal) {
      const totalDias = (fechaMax - fechaMin) / (1000 * 60 * 60 * 24);
      const diasDesdeInicio = (fechaActual - fechaMin) / (1000 * 60 * 60 * 24);
      const posicion = Math.max(0, (diasDesdeInicio / totalDias) * 100);
      
      meses.push({
        fecha: new Date(fechaActual),
        mesNombre: fechaActual.toLocaleDateString('es-ES', { month: 'short' }),
        ano: fechaActual.getFullYear(),
        posicion: posicion
      });
      
      // Avanzar al siguiente mes
      fechaActual.setMonth(fechaActual.getMonth() + 1);
    }

    return { 
      rangoFechas: { inicio: fechaMin, fin: fechaMax }, 
      escalaMeses: meses 
    };
  }, [indicadorSeleccionado]);

  // Funciones auxiliares
  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    try {
      const fechaObj = new Date(fecha);
      
      return fechaObj.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  const calcularPosicionBarra = (fechaInicio, fechaFin) => {
    const totalDias = (rangoFechas.fin - rangoFechas.inicio) / (1000 * 60 * 60 * 24);
    const diasDesdeInicio = (new Date(fechaInicio) - rangoFechas.inicio) / (1000 * 60 * 60 * 24);
    const duracionDias = (new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24);
    
    const left = Math.max(0, (diasDesdeInicio / totalDias) * 100);
    const width = Math.max(2, (duracionDias / totalDias) * 100);
    
    return { left: `${left}%`, width: `${width}%` };
  };

  const obtenerColorEstado = (estado) => {
    const estadoData = estadosConColores.find(e => e.nombre === estado);
    return estadoData ? estadoData.color : 'bg-gray-500';
  };

  const limpiarFiltros = () => {
    setVpFiltro('');
    setAreaFiltro('');
    setIndicadorFiltro('');
  };

  // Calcular posición de la línea "hoy"
  const posicionHoy = () => {
    if (!rangoFechas.inicio || !rangoFechas.fin) return 0;
    const totalDias = (rangoFechas.fin - rangoFechas.inicio) / (1000 * 60 * 60 * 24);
    const diasHastaHoy = (new Date() - rangoFechas.inicio) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.min(100, (diasHastaHoy / totalDias) * 100));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            Cronograma Gantt
          </h1>
          <p className="text-gray-600 mt-1">
            Selecciona VP → Área → Indicador para ver el cronograma de hitos
          </p>
        </div>
      </div>

      {/* Panel de Filtros */}
      <Card className="border-t-4 border-t-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros Jerárquicos
          </CardTitle>
          <CardDescription>
            Selecciona un indicador específico para visualizar su cronograma completo de hitos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label>1. Vicepresidencia</Label>
              <Select value={vpFiltro} onValueChange={setVpFiltro}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar VP" />
                </SelectTrigger>
                <SelectContent>
                  {vps.map(vp => (
                    <SelectItem key={vp} value={vp}>{vp}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>2. Área</Label>
              <Select value={areaFiltro} onValueChange={setAreaFiltro} disabled={!vpFiltro}>
                <SelectTrigger>
                  <SelectValue placeholder={vpFiltro ? "Seleccionar Área" : "Primero seleccione VP"} />
                </SelectTrigger>
                <SelectContent>
                  {areasDisponibles.map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>3. Indicador</Label>
              <Select value={indicadorFiltro} onValueChange={setIndicadorFiltro} disabled={!areaFiltro}>
                <SelectTrigger>
                  <SelectValue placeholder={areaFiltro ? "Seleccionar Indicador" : "Primero seleccione Área"} />
                </SelectTrigger>
                <SelectContent>
                  {indicadoresDisponibles.map(indicador => (
                    <SelectItem key={indicador.id} value={indicador.id}>
                      {indicador.nombreIndicador}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            {puedesMostrarGantt ? (
              <p className="text-sm text-gray-600">
                Mostrando cronograma de: <strong>{indicadorSeleccionado.nombreIndicador}</strong>
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Selecciona VP, Área e Indicador para ver el cronograma
              </p>
            )}
            
            {(vpFiltro || areaFiltro || indicadorFiltro) && (
              <Button variant="outline" size="sm" onClick={limpiarFiltros}>
                <Target className="h-4 w-4 mr-2" />
                Limpiar Filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mensaje de instrucciones cuando no hay indicador seleccionado */}
      {!puedesMostrarGantt && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="py-12">
            <div className="text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Selecciona un indicador específico
              </h3>
              <p className="text-gray-500 mb-4">
                Para ver el cronograma Gantt, sigue este orden:
              </p>
              <div className="max-w-md mx-auto">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">1. VP</span>
                  <span>→</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">2. Área</span>
                  <span>→</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">3. Indicador</span>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  El cronograma mostrará todos los hitos del indicador seleccionado
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gantt Chart - Solo cuando hay indicador seleccionado */}
      {puedesMostrarGantt && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold text-gray-800">
              Cronograma de {indicadorSeleccionado.nombreIndicador}
            </CardTitle>
            <CardDescription className="text-center">
              {indicadorSeleccionado.vp} • {indicadorSeleccionado.area} • 
              Período: {formatearFecha(rangoFechas.inicio)} - {formatearFecha(rangoFechas.fin)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {indicadorSeleccionado.hitos && indicadorSeleccionado.hitos.length > 0 ? (
              <div className="space-y-6">
                {/* Cronograma Principal */}
                <div className="border rounded-lg overflow-hidden">
                  {/* Encabezado con escala de tiempo */}
                  <div className="bg-gray-50 border-b">
                    <div className="flex">
                      {/* Columna de nombres de hitos */}
                      <div className="w-80 p-4 border-r bg-white">
                        <h4 className="font-semibold text-gray-800 text-center">Hitos del Proyecto</h4>
                      </div>
                      
                      {/* Escala de tiempo */}
                      <div className="flex-1 p-4">
                        <div className="relative">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-600">Inicio</span>
                            <span className="text-sm font-medium text-gray-600">Fin</span>
                          </div>
                          
                          {/* Marcadores de meses */}
                          <div className="relative h-8 border-b border-gray-300">
                            {escalaMeses.map((mes, index) => (
                              <div
                                key={index}
                                className="absolute transform -translate-x-1/2"
                                style={{ left: `${mes.posicion}%` }}
                              >
                                <div className="w-0.5 h-8 bg-gray-400"></div>
                                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                  <span className="text-xs text-gray-600">
                                    {mes.mesNombre} {mes.ano}
                                  </span>
                                  <br />
                                  <span className="text-xs text-gray-500">
                                    {mes.fecha.toLocaleDateString('es-ES', { month: 'short' })}
                                  </span>
                                </div>
                              </div>
                            ))}
                            
                            {/* Línea de HOY */}
                            <div
                              className="absolute top-0 w-0.5 h-8 bg-red-500 z-20"
                              style={{ left: `${posicionHoy()}%` }}
                            >
                              <div className="absolute -top-2 -left-2 w-5 h-5 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                              <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
                                <span className="text-xs text-red-600 font-bold whitespace-nowrap bg-red-100 px-2 py-1 rounded shadow">
                                  HOY
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Filas de hitos */}
                  <div className="bg-white relative">
                    {/* Línea vertical de HOY que se extiende por todos los hitos */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 opacity-60"
                      style={{ left: `calc(20rem + ${posicionHoy()}% * (100% - 20rem) / 100)` }}
                    ></div>
                    
                    {indicadorSeleccionado.hitos.map((hito, index) => (
                      <div key={index} className="flex border-b border-gray-100 hover:bg-gray-50">
                        {/* Información del hito */}
                        <div className="w-80 p-4 border-r">
                          <div className="space-y-1">
                            <h5 className="font-medium text-gray-800 text-sm">
                              {hito.nombreHito}
                            </h5>
                            <p className="text-xs text-gray-600">
                              ({hito.responsableHito})
                            </p>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs text-white ${obtenerColorEstado(hito.estadoHito)}`}>
                                {hito.estadoHito}
                              </span>
                              <span className="text-xs text-gray-500">
                                {hito.avanceHito || 0}%
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Barra de Gantt */}
                        <div className="flex-1 p-4">
                          <div className="relative h-8 bg-gray-100 rounded">
                            <div
                              className={`absolute h-full rounded flex items-center px-2 ${obtenerColorEstado(hito.estadoHito)}`}
                              style={calcularPosicionBarra(hito.fechaInicioHito, hito.fechaFinalizacionHito)}
                            >
                              <span className="text-white text-xs font-medium truncate">
                                {formatearFecha(hito.fechaInicioHito)} - {formatearFecha(hito.fechaFinalizacionHito)}
                              </span>
                            </div>
                            
                            {/* Barra de progreso */}
                            {hito.avanceHito > 0 && (
                              <div
                                className="absolute h-full bg-black bg-opacity-20 rounded"
                                style={{
                                  ...calcularPosicionBarra(hito.fechaInicioHito, hito.fechaFinalizacionHito),
                                  width: `${(parseFloat(calcularPosicionBarra(hito.fechaInicioHito, hito.fechaFinalizacionHito).width) * (hito.avanceHito || 0)) / 100}%`
                                }}
                              ></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Leyenda de Estados */}
                <Card>
                  <CardHeader>
                    <CardTitle>Leyenda de Estados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {estadosConColores.map((estado, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded ${estado.color}`}></div>
                          <span className="text-sm">{estado.nombre}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Responsables del Indicador */}
                <Card>
                  <CardHeader>
                    <CardTitle>Responsables del Indicador</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {responsables.map((responsable, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-slate-400"></div>
                          <span className="text-sm">{responsable}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Estadísticas Resumidas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-600">Total Hitos</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {indicadorSeleccionado.hitos.length}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-600">Completados</p>
                      <p className="text-2xl font-bold text-green-600">
                        {indicadorSeleccionado.hitos.filter(h => h.estadoHito === 'Completado').length}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-amber-500">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-600">En Progreso</p>
                      <p className="text-2xl font-bold text-amber-600">
                        {indicadorSeleccionado.hitos.filter(h => h.estadoHito === 'En Progreso').length}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-gray-500">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-600">Por Comenzar</p>
                      <p className="text-2xl font-bold text-gray-600">
                        {indicadorSeleccionado.hitos.filter(h => h.estadoHito === 'Por Comenzar').length}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Este indicador no tiene hitos definidos.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GanttProfesional; 