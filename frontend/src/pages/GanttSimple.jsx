import React from 'react';
import { useIndicadores } from '@/context/IndicadoresContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GanttSimple = () => {
  const { indicadores } = useIndicadores();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Cronograma Gantt (Simple)</h1>
        <p className="text-gray-600 mt-1">Versión simplificada para testing</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Indicadores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {indicadores && indicadores.length > 0 ? (
              indicadores.map((indicador, index) => (
                <div key={indicador.id || index} className="p-4 border rounded">
                  <h3 className="font-semibold">{indicador.nombreIndicador}</h3>
                  <p className="text-sm text-gray-600">Área: {indicador.area}</p>
                  <p className="text-sm text-gray-600">VP: {indicador.vp}</p>
                  
                  {indicador.hitos && indicador.hitos.length > 0 && (
                    <div className="mt-2 ml-4">
                      <h4 className="font-medium text-sm">Hitos:</h4>
                      {indicador.hitos.map((hito, hitoIndex) => (
                        <div key={hitoIndex} className="text-xs text-gray-500 ml-2">
                          • {hito.nombreHito} - {hito.avanceHito}%
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay indicadores disponibles
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GanttSimple; 