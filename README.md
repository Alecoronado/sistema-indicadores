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