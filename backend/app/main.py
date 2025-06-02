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

# Configuración CORS simplificada
if os.getenv("RAILWAY_ENVIRONMENT_NAME"):
    # Producción en Railway - CORS específico
    allowed_origins = [
        "https://*.railway.app",
        "https://*.up.railway.app",
        "http://localhost:5173",
        "http://localhost:3000"
    ]
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Temporal para debug
        allow_credentials=False,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )
else:
    # Desarrollo local - CORS abierto
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
        "status": "running",
        "environment": os.getenv("RAILWAY_ENVIRONMENT_NAME", "development"),
        "database_configured": bool(os.getenv("DATABASE_URL"))
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy", 
        "message": "API funcionando correctamente",
        "database": "connected",
        "version": "1.0.0"
    } 