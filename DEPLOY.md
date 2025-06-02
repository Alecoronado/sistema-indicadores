# 🚀 Guía de Deploy en Railway

Esta guía te llevará paso a paso para desplegar el Sistema de Indicadores en Railway.

## 📋 Prerrequisitos

- Cuenta en [Railway](https://railway.app/)
- Repositorio en GitHub con el código
- (Opcional) Railway CLI instalado

## 🏗️ Estructura de Deployment

El proyecto se despliega como **2 servicios separados** usando una estructura de **monorepo**:

```
/
├── frontend/        # 🎨 React + Vite + Tailwind
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── ...
├── backend/         # ⚡ FastAPI + PostgreSQL
│   ├── app/
│   ├── requirements.txt
│   └── ...
└── README.md
```

1. **Backend** (FastAPI + PostgreSQL) - `/backend`
2. **Frontend** (React + Vite) - `/frontend`

## 🔧 Paso 1: Deploy del Backend

### 1.1 Crear Nuevo Proyecto en Railway

1. Ve a [Railway](https://railway.app/) y haz login
2. Click en "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Elige tu repositorio

### 1.2 Configurar Backend Service

1. **Root Directory**: `/backend`
2. **Build Command**: Automático (usa nixpacks.toml)
3. **Start Command**: Automático (usa Procfile)

### 1.3 Agregar PostgreSQL Database

1. En tu proyecto Railway, click "New Service"
2. Selecciona "Database" → "PostgreSQL"
3. Railway automáticamente creará la variable `DATABASE_URL`

### 1.4 Variables de Entorno del Backend

Railway automáticamente provee:
- `DATABASE_URL` - URL de la base PostgreSQL
- `RAILWAY_ENVIRONMENT_NAME` - Nombre del entorno
- `PORT` - Puerto donde correr la aplicación

**✅ No necesitas configurar nada más para el backend**

### 1.5 Verificar Deploy del Backend

Una vez desplegado, visita:
- `https://tu-backend-url.up.railway.app/` - Página de bienvenida
- `https://tu-backend-url.up.railway.app/docs` - Documentación Swagger
- `https://tu-backend-url.up.railway.app/health` - Health check

## 🎨 Paso 2: Deploy del Frontend

### 2.1 Crear Segundo Servicio

1. En el mismo proyecto Railway, click "New Service"
2. Selecciona "GitHub Repo" (mismo repositorio)
3. Nombra el servicio "frontend" o similar

### 2.2 Configurar Frontend Service

1. **Root Directory**: `/frontend` ⭐ **IMPORTANTE: Cambio de estructura**
2. **Build Command**: `npm run build`
3. **Start Command**: `npm run start`

### 2.3 Variables de Entorno del Frontend

**OBLIGATORIO**: Configurar la URL del backend

```
VITE_API_URL=https://tu-backend-url.up.railway.app/api
```

**📝 Importante**: Reemplaza `tu-backend-url` con la URL real de tu backend desplegado.

### 2.4 Verificar Deploy del Frontend

Visita la URL de tu frontend: `https://tu-frontend-url.up.railway.app`

## 📊 Paso 3: Cargar Datos Iniciales

Después de que ambos servicios estén funcionando:

### Opción A: Via Railway Console

1. Ve a tu backend service en Railway
2. Click en la pestaña "Deploy"
3. Abre la consola del deploy más reciente
4. Ejecuta:
   ```bash
   python cargar_datos.py
   ```

### Opción B: Via Railway CLI

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Conectar al proyecto
railway link [project-id]

# Ejecutar comando en el backend
railway run python cargar_datos.py
```

## 🔍 Verificación Final

### ✅ Backend Funcionando
- [ ] `GET /health` retorna status "healthy"
- [ ] `GET /api/indicadores` retorna lista de indicadores
- [ ] `GET /docs` muestra documentación Swagger

### ✅ Frontend Funcionando  
- [ ] Página principal carga correctamente
- [ ] Dashboard muestra datos
- [ ] Gantt chart renderiza indicadores
- [ ] No hay errores de CORS en console

### ✅ Comunicación Frontend-Backend
- [ ] Frontend puede obtener datos del backend
- [ ] Filtros funcionan correctamente
- [ ] Actualizaciones se guardan en la base de datos

## 🐛 Troubleshooting

### Error de CORS
```
Access to fetch at 'backend-url' from origin 'frontend-url' has been blocked by CORS policy
```

**Solución**: Verifica que el frontend URL esté en la lista de orígenes permitidos en `backend/app/main.py`.

### Error 503 en Backend
```
Service Unavailable
```

**Solución**: El backend está arrancando. Railway puede tomar 1-2 minutos en inicializar PostgreSQL y la aplicación.

### Variables de Entorno
```
VITE_API_URL is undefined
```

**Solución**: 
1. Verifica que `VITE_API_URL` esté configurada en Railway
2. Debe empezar con `VITE_` para ser accesible en Vite
3. Haz redeploy después de agregar la variable

### Database Connection Error
```
psycopg2.OperationalError: could not connect to server
```

**Solución**: 
1. Verifica que el servicio PostgreSQL esté corriendo
2. Confirma que `DATABASE_URL` está disponible en las variables de entorno
3. Revisa los logs del servicio de base de datos

## 🎯 URLs Finales

Una vez completado el deploy:

- **Frontend**: `https://tu-frontend-url.up.railway.app`
- **Backend API**: `https://tu-backend-url.up.railway.app/api`
- **Documentación**: `https://tu-backend-url.up.railway.app/docs`
- **Base de Datos**: Gestionada por Railway (no acceso directo)

## 📈 Monitoreo

Railway proporciona:
- 📊 Métricas de uso y performance
- 📋 Logs en tiempo real  
- 🚨 Alertas de downtime
- 💰 Uso de recursos y costos

## 🔄 Actualizaciones

Para actualizar el sistema:
1. Haz push a tu repositorio GitHub
2. Railway automáticamente detectará los cambios
3. Se iniciará un nuevo deploy automáticamente
4. Zero-downtime deployment

---

## 💡 Tips de Optimización

- **Monorepo**: Mantén frontend/ y backend/ separados pero en el mismo repositorio
- **Base de datos**: Railway PostgreSQL incluye backups automáticos
- **Performance**: El backend usa gunicorn con 4 workers
- **Caching**: Considera agregar Redis para cache si es necesario
- **CDN**: Railway incluye CDN global para el frontend
- **SSL**: HTTPS automático sin configuración adicional

¡Tu sistema está listo para producción! 🎉 