import React, { useMemo } from 'react';
import { GanttComponent, Inject, Edit, Filter, Sort, Selection, Toolbar, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-gantt';
import { useIndicadores } from '@/context/IndicadoresContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, BarChart3, Filter as FilterIcon, Users } from 'lucide-react';

const GanttSyncfusion = () => {
  const { indicadores, areas } = useIndicadores();
  const [areaSeleccionada, setAreaSeleccionada] = React.useState('Todas');

  // Transformar datos para Syncfusion Gantt con mejor estructura
  const datosGantt = useMemo(() => {
    if (!indicadores || indicadores.length === 0) return [];

    let indicadoresFiltrados = indicadores;
    if (areaSeleccionada !== 'Todas') {
      indicadoresFiltrados = indicadores.filter(ind => ind.area === areaSeleccionada);
    }

    const datos = [];
    let taskID = 1;

    indicadoresFiltrados.forEach((indicador, indIndex) => {
      // Indicador principal
      const indicadorTask = {
        TaskID: taskID++,
        TaskName: indicador.nombreIndicador,
        StartDate: new Date(indicador.fechaInicioGeneral),
        EndDate: new Date(indicador.fechaFinalizacionGeneral),
        Progress: Math.floor(Math.random() * 101), // Progress aleatorio para demo
        Area: indicador.area,
        VP: indicador.vp,
        TipoIndicador: indicador.tipoIndicador,
        Assignee: indicador.vp || 'Sin asignar',
        Priority: 'High',
        subtasks: []
      };

      // Agregar hitos como subtareas con mejor información
      if (indicador.hitos && indicador.hitos.length > 0) {
        indicador.hitos.forEach((hito, hitoIndex) => {
          const progressValue = parseInt(hito.avanceHito) || Math.floor(Math.random() * 101);
          indicadorTask.subtasks.push({
            TaskID: taskID++,
            TaskName: hito.nombreHito,
            StartDate: new Date(hito.fechaInicioHito),
            EndDate: new Date(hito.fechaFinalizacionHito),
            Progress: progressValue,
            Assignee: hito.responsableHito || `Usuario ${hitoIndex + 1}`,
            Estado: hito.estadoHito,
            Orden: hito.ordenHito || hitoIndex + 1,
            Priority: progressValue > 80 ? 'High' : progressValue > 50 ? 'Medium' : 'Low'
          });
        });
      } else {
        // Si no hay hitos, crear algunas tareas de ejemplo
        const tareasEjemplo = [
          'Análisis y diseño',
          'Desarrollo inicial', 
          'Implementación',
          'Pruebas y validación',
          'Entrega final'
        ];

        tareasEjemplo.forEach((tarea, index) => {
          const startDate = new Date(indicador.fechaInicioGeneral);
          startDate.setDate(startDate.getDate() + (index * 7));
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 6);
          
          const progressValue = Math.floor(Math.random() * 101);
          
          indicadorTask.subtasks.push({
            TaskID: taskID++,
            TaskName: tarea,
            StartDate: startDate,
            EndDate: endDate,
            Progress: progressValue,
            Assignee: ['Martin Tamer', 'Rose Fuller', 'Fuller King', 'Jack Davolio'][index % 4],
            Estado: progressValue > 80 ? 'Completado' : progressValue > 50 ? 'En Proceso' : 'Pendiente',
            Priority: progressValue > 80 ? 'High' : progressValue > 50 ? 'Medium' : 'Low'
          });
        });
      }

      datos.push(indicadorTask);
    });

    return datos;
  }, [indicadores, areaSeleccionada]);

  // Configuración de campos de tarea
  const taskFields = {
    id: 'TaskID',
    name: 'TaskName',
    startDate: 'StartDate',
    endDate: 'EndDate',
    duration: 'Duration',
    progress: 'Progress',
    child: 'subtasks'
  };

  // Configuración de edición
  const editSettings = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
    allowTaskbarEditing: true,
    showDeleteConfirmDialog: true
  };

  // Configuración de etiquetas
  const labelSettings = {
    rightLabel: 'Assignee',
    taskLabel: 'Progress'
  };

  // Configuración de línea de tiempo
  const timelineSettings = {
    timelineUnitSize: 60,
    topTier: {
      unit: 'Month',
      format: 'MMM yyyy',
      count: 1
    },
    bottomTier: {
      unit: 'Day',
      count: 2
    }
  };

  // Configuración de divisor
  const splitterSettings = {
    position: '50%'
  };

  // Herramientas de toolbar
  const toolbar = ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit'];

  // Template para la columna de Assignee con avatar
  const assigneeTemplate = (props) => {
    const getAvatarColor = (name) => {
      const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
      const index = name ? name.length % colors.length : 0;
      return colors[index];
    };

    const getInitials = (name) => {
      if (!name || name === 'Sin asignar') return '?';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: getAvatarColor(props.Assignee) }}
        >
          {getInitials(props.Assignee)}
        </div>
        <span className="text-sm font-medium">{props.Assignee}</span>
      </div>
    );
  };

  // Template para mostrar el progreso
  const progressTemplate = (props) => {
    const getProgressColor = (progress) => {
      if (progress >= 80) return '#10b981'; // Verde
      if (progress >= 50) return '#f59e0b'; // Amarillo
      return '#ef4444'; // Rojo
    };

    return (
      <div className="flex items-center gap-2">
        <div className="w-16 bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full" 
            style={{ 
              width: `${props.Progress}%`,
              backgroundColor: getProgressColor(props.Progress)
            }}
          ></div>
        </div>
        <span className="text-xs font-bold" style={{ color: getProgressColor(props.Progress) }}>
          {props.Progress}%
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            Sistema de Indicadores
          </h1>
          <p className="text-gray-600 mt-1">Cronograma profesional con Syncfusion</p>
        </div>
        
        {/* Filtro por Área */}
        <div className="flex items-center gap-2">
          <FilterIcon className="h-5 w-5 text-gray-500" />
          <Select value={areaSeleccionada} onValueChange={setAreaSeleccionada}>
            <SelectTrigger className="w-[200px]">
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

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Proyectos</p>
              <p className="text-2xl font-bold text-blue-600">{datosGantt.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Tareas</p>
              <p className="text-2xl font-bold text-green-600">
                {datosGantt.reduce((total, ind) => total + (ind.subtasks?.length || 0), 0)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Completadas</p>
              <p className="text-2xl font-bold text-amber-600">
                {datosGantt.reduce((total, ind) => 
                  total + (ind.subtasks?.filter(h => h.Progress >= 100).length || 0), 0)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Promedio</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(datosGantt.reduce((total, ind) => 
                  total + (ind.subtasks?.reduce((sum, h) => sum + h.Progress, 0) / (ind.subtasks?.length || 1) || 0), 0) / (datosGantt.length || 1))}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Componente Gantt */}
      <Card className="shadow-lg">
        <CardContent className="p-0">
          {datosGantt.length > 0 ? (
            <div style={{ height: '700px' }}>
              <GanttComponent
                dataSource={datosGantt}
                taskFields={taskFields}
                editSettings={editSettings}
                labelSettings={labelSettings}
                timelineSettings={timelineSettings}
                splitterSettings={splitterSettings}
                toolbar={toolbar}
                allowSelection={true}
                allowFiltering={true}
                allowSorting={true}
                allowReordering={true}
                allowResizing={true}
                height="700px"
                gridLines="Both"
                treeColumnIndex={1}
                rowHeight={45}
                taskbarHeight={30}
                projectStartDate={new Date('2024-01-01')}
                projectEndDate={new Date('2024-12-31')}
              >
                <ColumnsDirective>
                  <ColumnDirective field="TaskID" visible={false} />
                  <ColumnDirective 
                    field="TaskName" 
                    headerText="Tarea" 
                    width="280"
                    clipMode="EllipsisWithTooltip"
                  />
                  <ColumnDirective 
                    field="Assignee" 
                    headerText="Asignado" 
                    width="200"
                    template={assigneeTemplate}
                  />
                  <ColumnDirective 
                    field="Progress" 
                    headerText="Progreso" 
                    width="120"
                    template={progressTemplate}
                  />
                  <ColumnDirective field="StartDate" headerText="Inicio" width="100" />
                  <ColumnDirective field="EndDate" headerText="Fin" width="100" />
                </ColumnsDirective>
                <Inject services={[Edit, Filter, Sort, Selection, Toolbar]} />
              </GanttComponent>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No hay proyectos para mostrar</h3>
              <p>Agrega algunos indicadores para ver el cronograma profesional.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GanttSyncfusion; 