from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import indicadores
from .database import engine
from .models import indicador

# Crear las tablas en la base de datos
indicador.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema de Indicadores API",
    description="API para el sistema de gestión de indicadores",
    version="1.0.0"
)

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],  # URLs de tu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers con prefijo /api
app.include_router(indicadores.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Sistema de Indicadores"} 