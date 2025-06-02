# 🚀 Sistema de Indicadores Horizons

> **Dashboard empresarial para gestión de indicadores, hitos y cronogramas**

## 📋 Características Principales

- 📊 **Dashboard Interactivo** - Visualización en tiempo real de indicadores
- 📈 **Gantt Profesional** - Cronogramas por meses con línea de tiempo actual
- 🎯 **Gestión de Hitos** - Actualización individual de progreso y estados
- 📱 **Diseño Responsivo** - Interfaz moderna y adaptable
- 🔄 **Filtros Jerárquicos** - VP → Área → Indicador para navegación intuitiva

## 🏗️ Estructura del Proyecto

```
horizons/
├── 📁 src/                 # Frontend React + Vite
│   ├── 📁 components/      # Componentes reutilizables
│   ├── 📁 pages/           # Páginas principales (Dashboard, Gantt, etc.)
│   ├── 📁 context/         # Estado global de la aplicación
│   └── 📁 hooks/           # Hooks personalizados
├── 📁 backend/             # API FastAPI + SQLAlchemy
│   ├── 📁 app/             # Aplicación principal
│   ├── cargar_datos.py     # Script de carga de datos
│   └── analizar_datos.py   # Herramientas de análisis
├── Base de datos.xlsx      # Datos fuente organizacionales
├── start.bat              # 🚀 Iniciador automático completo
└── install_dependencies.bat # 📦 Instalador de dependencias
```

## ⚡ Inicio Rápido

### 1️⃣ Instalar Dependencias (Solo la primera vez)
```bash
install_dependencies.bat
```

### 2️⃣ Iniciar Sistema Completo
```bash
start.bat
```

**¡Listo!** El sistema se abrirá automáticamente:
- 🌐 **Frontend:** http://localhost:5173
- 📡 **Backend:** http://localhost:8000
- 📚 **API Docs:** http://localhost:8000/docs

## 🌐 Deployment en Producción

### **📋 Opciones Recomendadas:**

#### **Frontend (React + Vite):**
- **Vercel** - Deployment automático desde GitHub
- **Netlify** - Alternativa robusta
- **GitHub Pages** - Gratuito para proyectos públicos

#### **Backend (FastAPI + Python):**
- **Railway** - Base de datos PostgreSQL incluida
- **Render** - Plan gratuito disponible
- **Heroku** - Opción tradicional

#### **Base de Datos:**
- **Railway PostgreSQL** - Integrado con backend
- **Supabase** - PostgreSQL managed
- **ElephantSQL** - PostgreSQL especializado

### **🔧 Configuración para Deployment:**

1. **Clonar repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/horizons-indicadores
   cd horizons-indicadores
   ```

2. **Frontend (Vercel/Netlify):**
   ```bash
   npm install
   npm run build
   ```

3. **Backend (Railway/Render):**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

4. **Variables de entorno:**
   - Copiar `env.example` y configurar con datos de producción
   - Configurar `DATABASE_URL` en el servicio de hosting

### **🌍 URLs de Producción:**
- **Frontend:** https://tu-app.vercel.app
- **Backend:** https://tu-backend.railway.app
- **API Docs:** https://tu-backend.railway.app/docs

## 🎯 Páginas Disponibles

### 📊 **Dashboard Principal**
- Métricas generales de todos los indicadores
- Filtros por VP y Área
- Estadísticas en tiempo real

### 📈 **Gantt Profesional** 
- Vista cronológica por indicador específico
- Escala temporal por meses
- Línea roja de "HOY" 
- Colores por estado de hitos

### ✏️ **Actualizar Indicador**
- Filtros jerárquicos: VP → Área → Indicador → Hito
- Actualización individual de hitos
- Modal de edición intuitivo

### 📋 **Historial de Indicadores**
- Vista detallada de todos los indicadores
- Estados y responsables
- Fechas de inicio y finalización
- Exportación a Excel

## 🔧 Gestión de Datos

### Cargar Nuevos Datos
```bash
cd backend
python cargar_datos.py
```

### Analizar Estructura de Datos
```bash
cd backend
python analizar_datos.py
```

## 📊 Datos Organizacionales

El sistema gestiona **14 indicadores únicos** distribuidos en:

- **VPD** (6 indicadores): Alianza Estratégica, Análisis y Estudios Económicos, Efectividad y Desarrollo
- **VPE** (4 indicadores): TEI, Talento Humano  
- **PRE** (4 indicadores): Auditoría, Comunicación, Gestión de Riesgos, Legal

**Total:** 83 hitos con estados reales de progreso.

## 🎨 Tecnologías

- **Frontend:** React 18 + Vite + TailwindCSS + Lucide Icons
- **Backend:** FastAPI + SQLAlchemy + PostgreSQL/SQLite
- **UI:** shadcn/ui components
- **Visualización:** Gantt charts personalizados
- **Exportación:** Excel (XLSX) nativo

## 📝 Licencia

Sistema desarrollado para gestión interna organizacional.

---

💡 **Tip:** Usa `diagnosticar.bat` si encuentras problemas de conectividad.

## 🚀 Deploy en Railway

### Backend (FastAPI)

1. **Crear nuevo proyecto en Railway**
   ```bash
   # Conecta tu repositorio a Railway
   # Selecciona la carpeta backend/ como source
   ```

2. **Configurar variables de entorno**
   ```
   # Railway automáticamente provee:
   DATABASE_URL=postgresql://...
   RAILWAY_ENVIRONMENT_NAME=production
   
   # Opcional (añadir si necesario):
   FRONTEND_URL=https://tu-frontend-url.up.railway.app
   ```

3. **Configurar el deployment**
   - Root Directory: `/backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --host 0.0.0.0 --port $PORT`

### Frontend (React + Vite)

1. **Crear otro proyecto en Railway**
   ```bash
   # Conecta el mismo repositorio
   # Selecciona la carpeta raíz como source
   ```

2. **Configurar variables de entorno**
   ```
   VITE_API_URL=https://tu-backend-url.up.railway.app/api
   ```

3. **Configurar el deployment**
   - Build Command: `npm run build`
   - Start Command: `npm run start`
   - Root Directory: `/` (raíz del proyecto)

### Datos Iniciales

Después del deployment del backend, cargar los datos:

```bash
# Conectarse al backend via Railway CLI o directamente en la plataforma
python backend/cargar_datos.py
```

## 🛠️ Desarrollo Local

### Prerrequisitos

- Node.js 18+
- Python 3.9+
- PostgreSQL (opcional, usa SQLite como fallback)

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd sistema-indicadores
   ```

2. **Frontend**
   ```bash
   npm install
   npm run dev
   ```

3. **Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   python -m uvicorn app.main:app --reload
   ```

4. **Cargar datos (opcional)**
   ```bash
   cd backend
   python cargar_datos.py
   ```

## 📊 Características

- ✅ Dashboard interactivo con métricas en tiempo real
- ✅ Gráficos Gantt profesionales para seguimiento de proyectos
- ✅ Gestión de indicadores por VP y área
- ✅ Filtrado avanzado por estado, tipo y responsable
- ✅ Datos reales importados desde Excel
- ✅ API REST completa con FastAPI
- ✅ Base de datos PostgreSQL con fallback a SQLite
- ✅ Deploy optimizado para Railway

## 📈 API Endpoints

- `GET /api/indicadores` - Obtener todos los indicadores
- `GET /api/indicadores/area/{area}` - Filtrar por área
- `POST /api/indicadores` - Crear nuevo indicador
- `PUT /api/indicadores/{id}` - Actualizar indicador
- `DELETE /api/indicadores/{id}` - Eliminar indicador
- `GET /api/indicadores/estadisticas/dashboard` - Estadísticas del dashboard

## 💾 Base de Datos

El sistema utiliza PostgreSQL en producción (Railway) con SQLite como fallback para desarrollo local. Los datos incluyen:

- **14 Indicadores** distribuidos por VPs (VPD, VPE, PRE)
- **83 Hitos** con fechas reales y estados de progreso
- **Áreas organizacionales** específicas por VP
- **Estados:** En Progreso, Completado, Por Comenzar
- **Tipos:** Estratégico, Gestion

## ⚡ Comandos Útiles

```bash
# Desarrollo completo
npm run dev                 # Frontend en puerto 5173
cd backend && uvicorn app.main:app --reload  # Backend en puerto 8000

# Producción
npm run build              # Build del frontend
npm run start              # Servir frontend en producción
```

## 🐛 Troubleshooting

- **Error de CORS:** Verificar configuración de orígenes en `backend/app/main.py`
- **Base de datos:** Railway automáticamente provee PostgreSQL via `DATABASE_URL`
- **Variables de entorno:** Usar `VITE_API_URL` para el frontend
- **Timeout:** El backend tiene timeout de 30s para arranque en Railway 