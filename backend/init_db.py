import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def create_database():
    try:
        # Configuración de la base de datos
        DB_USER = "postgres"
        DB_PASSWORD = "Jan27147"
        DB_HOST = "localhost"
        DB_PORT = "5432"
        DB_NAME = "indicadores_db"

        # Conectar a PostgreSQL
        conn = psycopg2.connect(
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        
        # Crear cursor
        cur = conn.cursor()
        
        # Verificar si la base de datos existe
        cur.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{DB_NAME}'")
        exists = cur.fetchone()
        
        if not exists:
            # Crear la base de datos
            cur.execute(f'CREATE DATABASE {DB_NAME}')
            print(f"Base de datos '{DB_NAME}' creada exitosamente")
        else:
            print(f"La base de datos '{DB_NAME}' ya existe")
        
        # Cerrar conexión
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"Error: {e}")
        print("\nPor favor, asegúrate de que:")
        print("1. PostgreSQL esté instalado y corriendo")
        print("2. Las credenciales sean correctas")
        print("3. El usuario tenga permisos para crear bases de datos")

if __name__ == "__main__":
    create_database() 