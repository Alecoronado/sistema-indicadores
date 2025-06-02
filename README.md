# 🚀 Sistema de Indicadores Horizons

Un sistema completo de gestión de indicadores empresariales con dashboard interactivo y cronograma de hitos.

## 🏗️ Estructura del Proyecto (Monorepo)

```
/
├── 📁 frontend/              # 🎨 React + Vite + Tailwind
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── pages/           # Páginas de la aplicación
│   │   ├── services/        # Servicios API
│   │   └── utils/           # Utilidades
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── 📁 backend/               # ⚡ FastAPI + PostgreSQL
│   ├── app/
│   │   ├── api/             # Endpoints API
│   │   ├── models/          # Modelos SQLAlchemy
│   │   ├── services/        # Lógica de negocio
│   │   └── main.py          # Aplicación principal
│   ├── requirements.txt
│   └── cargar_datos.py
│
├── 📁 docs/                  # 📚 Documentación
│   ├── DEPLOY.md            # Guía de despliegue
│   └── railway-checklist.md
│
├── start.bat                 # 🚀 Script de inicio
├── install_dependencies.bat # 📦 Instalador de dependencias
└── README.md                # 📋 Este archivo
```

## ✨ Características

- **📊 Dashboard Interactivo**: Visualización de indicadores en tiempo real
- **📈 Gantt Chart**: Cronograma visual de hitos y progreso
- **🎯 Gestión de Indicadores**: CRUD completo de indicadores
- **🔍 Filtros Avanzados**: Por categoría, estado, responsable
- **📱 Responsive Design**: Optimizado para desktop y móvil
- **🔒 API Documentada**: Swagger/OpenAPI integrado
- **🚀 Deploy en Railway**: Configuración lista para producción

## 🛠️ Tecnologías

### Frontend (`/frontend`)
- ⚛️ **React 18** - Biblioteca de UI
- ⚡ **Vite** - Build tool y dev server
- 🎨 **Tailwind CSS** - Framework de estilos
- 📊 **Lucide React** - Íconos
- 🎭 **Framer Motion** - Animaciones
- 🌐 **Axios** - Cliente HTTP

### Backend (`/backend`)
- 🐍 **FastAPI** - Framework web moderno
- 🗄️ **SQLAlchemy** - ORM
- 🐘 **PostgreSQL** - Base de datos
- 📝 **Pydantic** - Validación de datos
- 🔐 **Python-JOSE** - JWT tokens
- 🔒 **Passlib** - Hash de passwords

## 🚀 Inicio Rápido

### 1. Clonar Repositorio
```bash
git clone <tu-repositorio>
cd sistema-indicadores
```

### 2. Instalar Dependencias
```bash
# Windows
.\install_dependencies.bat

# Linux/Mac
chmod +x install_dependencies.sh
./install_dependencies.sh
```

### 3. Iniciar Aplicación
```bash
# Windows
.\start.bat

# Linux/Mac  
chmod +x start.sh
./start.sh
```

### 4. Acceder a la Aplicación
- 🌐 **Frontend**: http://localhost:5173
- 📡 **Backend**: http://localhost:8000
- 📚 **API Docs**: http://localhost:8000/docs

## 📦 Instalación Manual

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate     # Windows

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend  
```bash
cd frontend
npm install
npm run dev
```

## 🗄️ Base de Datos

### Cargar Datos Iniciales
```bash
cd backend
python cargar_datos.py
```

### Estructura de Datos
- **Indicadores**: Métricas empresariales
- **Hitos**: Eventos y fechas importantes
- **Responsables**: Usuarios asignados
- **Categorías**: Clasificación de indicadores

## 🚀 Deploy en Railway

Consulta la **[Guía de Deploy](DEPLOY.md)** para instrucciones detalladas de despliegue en Railway.

### Configuración Rápida
1. **Backend Service**: Root directory = `/backend`
2. **Frontend Service**: Root directory = `/frontend`
3. **Variables de entorno**: `VITE_API_URL` en frontend

## 🔧 Desarrollo

### Scripts Disponibles

#### Frontend (`/frontend`)
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linter
```

#### Backend (`/backend`)
```bash
uvicorn app.main:app --reload  # Servidor de desarrollo
python cargar_datos.py         # Cargar datos iniciales
python init_db.py              # Inicializar base de datos
```

### Estructura de API

```
GET    /api/indicadores        # Listar indicadores
POST   /api/indicadores        # Crear indicador
PUT    /api/indicadores/{id}   # Actualizar indicador
DELETE /api/indicadores/{id}   # Eliminar indicador
GET    /health                 # Health check
GET    /docs                   # Documentación Swagger
```

## 🔍 Troubleshooting

### Errores Comunes

**1. Puerto 5173 ocupado**
```bash
cd frontend
npm run dev -- --port 3000
```

**2. Error de conexión a base de datos**
```bash
# Verificar PostgreSQL esté corriendo
# Verificar variable DATABASE_URL
```

**3. Dependencias no encontradas**
```bash
# Reinstalar dependencias
rm -rf frontend/node_modules
rm -rf backend/venv
.\install_dependencies.bat
```

## 📈 Características del Dashboard

- 📊 **Gráficos Dinámicos**: Visualización de progreso
- 🎯 **Indicadores KPI**: Métricas clave
- 📅 **Cronograma Gantt**: Timeline de hitos
- 🔍 **Filtros Inteligentes**: Búsqueda y categorización
- 📱 **Responsive**: Adaptable a cualquier pantalla
- 🎨 **Tema Moderno**: UI/UX optimizada

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

- 📧 Email: soporte@horizons.com
- 📚 Documentación: [/docs](./docs/)
- 🐛 Issues: [GitHub Issues](link-to-issues)

---

**Hecho con ❤️ para la gestión eficiente de indicadores empresariales** 