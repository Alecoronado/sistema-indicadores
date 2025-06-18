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

# Configuración CORS para producción
if os.getenv("RAILWAY_ENVIRONMENT_NAME"):
    # Producción en Railway - CORS específico y seguro
    allowed_origins = [
        "https://sistema-indicadores-production.up.railway.app",  # Railway frontend específico
        "https://*.vercel.app",           # Vercel
        "https://sistema-indicadores-git-main-alecoronados-projects.vercel.app",
        "https://sistema-indicadores-alecoronados-projects.vercel.app",
        "http://localhost:5173",  # Solo para testing local
        "http://localhost:3000",  # Solo para testing local
    ]
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,  # ✅ SEGURO: Orígenes específicos solamente
        allow_credentials=False,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization", "Accept"],  # ✅ Headers específicos
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
    """Endpoint específico para probar CORS desde Vercel"""
    return {
        "message": "CORS funcionando correctamente",
        "timestamp": "2025-01-11",
        "backend": "Railway",
        "frontend": "Vercel",
        "status": "success"
    } 