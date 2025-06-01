from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Configuración de la base de datos para desarrollo y producción
# Usar DATABASE_URL de entorno si está disponible (para deployment)
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Producción: usar DATABASE_URL directamente
    # Reemplazar postgresql:// con postgresql+psycopg2:// si es necesario
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_DATABASE_URL = DATABASE_URL
    print("🌐 Usando DATABASE_URL de producción")
else:
    # Desarrollo: intentar PostgreSQL local, si falla usar SQLite
    try:
        DB_USER = os.getenv("DB_USER", "postgres")
        DB_PASSWORD = os.getenv("DB_PASSWORD", "Jan27147")
        DB_HOST = os.getenv("DB_HOST", "localhost")
        DB_PORT = os.getenv("DB_PORT", "5432")
        DB_NAME = os.getenv("DB_NAME", "indicadores_db")
        
        SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        # Probar conexión
        engine.connect()
        print("✅ Conectado a PostgreSQL local")
    except Exception as e:
        print(f"⚠️  PostgreSQL no disponible: {e}")
        print("🔄 Usando SQLite como respaldo...")
        SQLALCHEMY_DATABASE_URL = "sqlite:///./indicadores.db"

# Crear engine
if DATABASE_URL:
    # Producción
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
else:
    # Desarrollo
    if "postgresql" in SQLALCHEMY_DATABASE_URL:
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
    else:
        engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 