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
    print(f"🌐 DATABASE_URL encontrada: {DATABASE_URL[:50]}...")
    
    # Reemplazar postgresql:// con postgresql+psycopg2:// si es necesario
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
        print("🔄 Convertido postgres:// a postgresql://")
    
    SQLALCHEMY_DATABASE_URL = DATABASE_URL
    
    try:
        # Probar conexión a PostgreSQL en producción
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        connection = engine.connect()
        connection.close()
        print("✅ Conectado exitosamente a PostgreSQL de producción")
    except Exception as e:
        print(f"❌ Error conectando a PostgreSQL: {e}")
        print("🔄 Fallback a SQLite...")
        SQLALCHEMY_DATABASE_URL = "sqlite:///./indicadores.db"
        engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
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
        engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# Crear engine final si no se creó arriba
if DATABASE_URL and 'engine' not in locals():
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