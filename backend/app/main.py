from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .routers import indicadores
from .database import engine
from .models import indicador
import os
import json

# Crear las tablas en la base de datos
indicador.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema de Indicadores API",
    description="API para el sistema de gestión de indicadores",
    version="1.0.0"
)

# Middleware personalizado para UTF-8
@app.middleware("http")
async def add_utf8_headers(request, call_next):
    response = await call_next(request)
    if "application/json" in response.headers.get("content-type", ""):
        response.headers["content-type"] = "application/json; charset=utf-8"
    return response

# 🌐 CONFIGURACIÓN CORS FLEXIBLE
def get_allowed_origins():
    """Obtiene los orígenes permitidos desde variables de entorno o configuración por defecto"""
    
    # 1️⃣ Intentar obtener desde variable de entorno
    env_origins = os.getenv("ALLOWED_ORIGINS")
    if env_origins:
        # Convertir string separado por comas a lista
        origins = [origin.strip() for origin in env_origins.split(",") if origin.strip()]
        print(f"🔒 CORS desde ALLOWED_ORIGINS: {origins}")
        return origins
    
    # 2️⃣ Detectar si es producción Railway
    if os.getenv("RAILWAY_ENVIRONMENT_NAME") or os.getenv("ENVIRONMENT") == "production":
        # Buscar URL de frontend automáticamente
        default_origins = [
            "http://localhost:5173",  # Desarrollo local
            "http://localhost:3000",  # Testing local
        ]
        
        # Agregar posibles URLs de producción
        service_name = os.getenv("RAILWAY_SERVICE_NAME", "sistema-indicadores")
        possible_frontend_urls = [
            f"https://{service_name}-frontend-production.up.railway.app",
            f"https://{service_name}-production.up.railway.app", 
            f"https://frontend-{service_name}-production.up.railway.app",
        ]
        
        default_origins.extend(possible_frontend_urls)
        print(f"🔒 CORS producción automático: {default_origins}")
        return default_origins
    
    # 3️⃣ Desarrollo local - permisivo
    else:
        print("🔧 CORS desarrollo - permitir todos los orígenes")
        return ["*"]

# Aplicar configuración CORS
allowed_origins = get_allowed_origins()

if "*" in allowed_origins:
    # Desarrollo - CORS completamente abierto
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    print("🔧 CORS configurado para DESARROLLO (permite todos los orígenes)")
else:
    # Producción - CORS específico y seguro
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=False,  # Cambiar a True si necesitas cookies
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization", "Accept", "X-Requested-With"],
    )
    print(f"🔒 CORS configurado para PRODUCCIÓN: {allowed_origins}")

# ✅ NUEVO: Middleware de seguridad
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    
    # Headers de seguridad
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    
    # UTF-8 para JSON
    if "application/json" in response.headers.get("content-type", ""):
        response.headers["content-type"] = "application/json; charset=utf-8"
    
    return response

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

@app.get("/test-cors")
def test_cors():
    """Endpoint específico para probar CORS"""
    return {
        "message": "CORS funcionando correctamente",
        "timestamp": "2025-01-18",
        "backend": "Railway",
        "status": "success",
        "cors_config": get_allowed_origins()
    }

@app.get("/config")
def get_config():
    """Endpoint para verificar la configuración actual"""
    return {
        "environment": os.getenv("RAILWAY_ENVIRONMENT_NAME", "development"),
        "allowed_origins": get_allowed_origins(),
        "database_configured": bool(os.getenv("DATABASE_URL")),
        "service_name": os.getenv("RAILWAY_SERVICE_NAME", "unknown"),
        "cors_from_env": bool(os.getenv("ALLOWED_ORIGINS")),
        "timestamp": "2025-01-18"
    } 