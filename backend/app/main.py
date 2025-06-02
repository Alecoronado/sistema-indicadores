from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import indicadores
from .database import engine
from .models import indicador
import os

# Crear las tablas en la base de datos
indicador.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema de Indicadores API",
    description="API para el sistema de gestión de indicadores",
    version="1.0.0"
)

# Configuración CORS optimizada para Railway
allowed_origins = [
    "http://localhost:5173", 
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

# Variables de entorno para Railway
FRONTEND_URL = os.getenv("FRONTEND_URL")
RAILWAY_STATIC_URL = os.getenv("RAILWAY_STATIC_URL") 
RAILWAY_PUBLIC_DOMAIN = os.getenv("RAILWAY_PUBLIC_DOMAIN")

# Agregar URLs de Railway si están disponibles
if FRONTEND_URL:
    allowed_origins.append(FRONTEND_URL)
    
if RAILWAY_STATIC_URL:
    allowed_origins.append(f"https://{RAILWAY_STATIC_URL}")
    
if RAILWAY_PUBLIC_DOMAIN:
    allowed_origins.append(f"https://{RAILWAY_PUBLIC_DOMAIN}")

# URLs comunes de Railway
railway_patterns = [
    "https://*.railway.app",
    "https://*.up.railway.app",
]

# En producción, usar orígenes específicos
if os.getenv("RAILWAY_ENVIRONMENT_NAME"):
    # Estamos en Railway
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins + ["https://sistema-indicadores-frontend-production.up.railway.app"],
        allow_credentials=False,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )
else:
    # Desarrollo local
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Incluir routers con prefijo /api
app.include_router(indicadores.router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "message": "Bienvenido a la API de Sistema de Indicadores",
        "version": "1.0.0",
        "environment": os.getenv("RAILWAY_ENVIRONMENT_NAME", "development")
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy", 
        "message": "API funcionando correctamente",
        "database": "connected"
    } 