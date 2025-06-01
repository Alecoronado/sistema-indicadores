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

# Configuración CORS para desarrollo y producción
allowed_origins = [
    "http://localhost:5173", 
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    # Permitir Vercel y otros servicios de hosting
    "https://*.vercel.app",
    "https://*.netlify.app",
]

# Si estamos en producción, agregar orígenes adicionales
FRONTEND_URL = os.getenv("FRONTEND_URL")
if FRONTEND_URL:
    allowed_origins.append(FRONTEND_URL)

# Para desarrollo, permitir cualquier origen HTTPS
allowed_origins.extend([
    "https://sistema-indicadores-frontend.vercel.app",
    "https://sistema-indicadores.vercel.app"
])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers con prefijo /api
app.include_router(indicadores.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Sistema de Indicadores"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "API funcionando correctamente"} 