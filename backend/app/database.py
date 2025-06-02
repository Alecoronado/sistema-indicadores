from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Configuración de la base de datos optimizada para Railway
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Railway proporciona DATABASE_URL automáticamente
    print(f"🌐 DATABASE_URL encontrada: {DATABASE_URL[:50]}...")
    
    # Railway usa postgresql:// por defecto, convertir si es necesario
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
        print("🔄 Convertido postgres:// a postgresql://")
    
    SQLALCHEMY_DATABASE_URL = DATABASE_URL
    
    # Configuración específica para Railway PostgreSQL
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True,  # Verificar conexiones antes de usar
        pool_recycle=300,    # Reciclar conexiones cada 5 minutos
        connect_args={
            "options": "-c timezone=America/Guatemala"  # Configurar timezone
        }
    )
    
    try:
        # Verificar conexión
        connection = engine.connect()
        connection.close()
        print("✅ Conectado exitosamente a PostgreSQL de Railway")
    except Exception as e:
        print(f"❌ Error conectando a PostgreSQL en Railway: {e}")
        # En Railway, si DATABASE_URL falla, no hay fallback
        raise
        
elif os.getenv("RAILWAY_ENVIRONMENT_NAME"):
    # Estamos en Railway pero no hay DATABASE_URL (error de configuración)
    print("❌ En Railway pero no se encontró DATABASE_URL")
    raise Exception("DATABASE_URL requerida en Railway")
    
else:
    # Desarrollo local
    try:
        DB_USER = os.getenv("DB_USER", "postgres")
        DB_PASSWORD = os.getenv("DB_PASSWORD", "Jan27147")
        DB_HOST = os.getenv("DB_HOST", "localhost")
        DB_PORT = os.getenv("DB_PORT", "5432")
        DB_NAME = os.getenv("DB_NAME", "indicadores_db")
        
        SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        
        # Probar conexión
        connection = engine.connect()
        connection.close()
        print("✅ Conectado a PostgreSQL local")
        
    except Exception as e:
        print(f"⚠️  PostgreSQL no disponible: {e}")
        print("🔄 Usando SQLite como respaldo para desarrollo...")
        SQLALCHEMY_DATABASE_URL = "sqlite:///./indicadores.db"
        engine = create_engine(
            SQLALCHEMY_DATABASE_URL, 
            connect_args={"check_same_thread": False}
        )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 