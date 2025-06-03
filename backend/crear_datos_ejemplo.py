#!/usr/bin/env python3
"""
Script para crear datos de ejemplo profesionales
NO DEPENDE DE EXCEL - Datos hardcodeados realistas
"""

import os
import sys
from datetime import datetime, date, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Agregar el directorio padre al path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import Base
from app.models.indicador import Indicador, Hito

def get_database_url():
    """Obtener URL de base de datos"""
    database_url = os.getenv("DATABASE_URL")
    if database_url and database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    return database_url or "sqlite:///./indicadores.db"

def crear_datos_ejemplo():
    """Crear datos de ejemplo profesionales"""
    
    # Conectar a BD
    database_url = get_database_url()
    engine = create_engine(database_url)
    Base.metadata.create_all(bind=engine)
    
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()
    
    try:
        # Verificar si ya hay datos
        count = session.query(Indicador).count()
        if count > 0:
            print(f"✅ Ya existen {count} indicadores. No se crearán datos de ejemplo.")
            return {"status": "existing", "count": count}
        
        print("🚀 Creando datos de ejemplo profesionales...")
        
        # DATOS DE EJEMPLO REALISTAS
        indicadores_ejemplo = [
            {
                "vp": "VP Operaciones",
                "area": "Tecnología",
                "nombreIndicador": "Transformación Digital 2024",
                "tipoIndicador": "Estratégico",
                "fechaInicioGeneral": date(2024, 1, 15),
                "fechaFinalizacionGeneral": date(2024, 12, 31),
                "responsableGeneral": "Carlos Mendoza",
                "responsableCargaGeneral": "Ana García",
                "hitos": [
                    {
                        "nombreHito": "Análisis de Sistemas Actuales",
                        "fechaInicioHito": date(2024, 1, 15),
                        "fechaFinalizacionHito": date(2024, 3, 15),
                        "avanceHito": 100,
                        "estadoHito": "Completado",
                        "responsableHito": "Carlos Mendoza"
                    },
                    {
                        "nombreHito": "Diseño de Nueva Arquitectura",
                        "fechaInicioHito": date(2024, 3, 1),
                        "fechaFinalizacionHito": date(2024, 5, 30),
                        "avanceHito": 85,
                        "estadoHito": "En Progreso",
                        "responsableHito": "Luis Rodriguez"
                    },
                    {
                        "nombreHito": "Implementación Fase 1",
                        "fechaInicioHito": date(2024, 5, 15),
                        "fechaFinalizacionHito": date(2024, 8, 31),
                        "avanceHito": 45,
                        "estadoHito": "En Progreso",
                        "responsableHito": "María López"
                    },
                    {
                        "nombreHito": "Pruebas y Validación",
                        "fechaInicioHito": date(2024, 8, 15),
                        "fechaFinalizacionHito": date(2024, 11, 30),
                        "avanceHito": 0,
                        "estadoHito": "Pendiente",
                        "responsableHito": "Pedro Sánchez"
                    }
                ]
            },
            {
                "vp": "VP Comercial",
                "area": "Ventas",
                "nombreIndicador": "Expansión Mercado Nacional",
                "tipoIndicador": "Táctico",
                "fechaInicioGeneral": date(2024, 2, 1),
                "fechaFinalizacionGeneral": date(2024, 10, 31),
                "responsableGeneral": "Elena Castro",
                "responsableCargaGeneral": "Roberto Kim",
                "hitos": [
                    {
                        "nombreHito": "Investigación de Mercado",
                        "fechaInicioHito": date(2024, 2, 1),
                        "fechaFinalizacionHito": date(2024, 3, 31),
                        "avanceHito": 100,
                        "estadoHito": "Completado",
                        "responsableHito": "Elena Castro"
                    },
                    {
                        "nombreHito": "Estrategia de Penetración",
                        "fechaInicioHito": date(2024, 3, 15),
                        "fechaFinalizacionHito": date(2024, 5, 15),
                        "avanceHito": 75,
                        "estadoHito": "En Progreso",
                        "responsableHito": "Roberto Kim"
                    },
                    {
                        "nombreHito": "Lanzamiento en 3 Ciudades",
                        "fechaInicioHito": date(2024, 5, 1),
                        "fechaFinalizacionHito": date(2024, 7, 31),
                        "avanceHito": 30,
                        "estadoHito": "En Progreso",
                        "responsableHito": "Sandra Torres"
                    }
                ]
            },
            {
                "vp": "VP Recursos Humanos",
                "area": "RRHH", 
                "nombreIndicador": "Programa Bienestar Laboral",
                "tipoIndicador": "Operativo",
                "fechaInicioGeneral": date(2024, 1, 8),
                "fechaFinalizacionGeneral": date(2024, 6, 30),
                "responsableGeneral": "Isabel Vargas",
                "responsableCargaGeneral": "Diego Morales",
                "hitos": [
                    {
                        "nombreHito": "Diagnóstico Clima Laboral",
                        "fechaInicioHito": date(2024, 1, 8),
                        "fechaFinalizacionHito": date(2024, 2, 15),
                        "avanceHito": 100,
                        "estadoHito": "Completado",
                        "responsableHito": "Isabel Vargas"
                    },
                    {
                        "nombreHito": "Diseño de Programas",
                        "fechaInicioHito": date(2024, 2, 1),
                        "fechaFinalizacionHito": date(2024, 3, 31),
                        "avanceHito": 90,
                        "estadoHito": "En Progreso",
                        "responsableHito": "Diego Morales"
                    },
                    {
                        "nombreHito": "Implementación Piloto",
                        "fechaInicioHito": date(2024, 3, 15),
                        "fechaFinalizacionHito": date(2024, 5, 31),
                        "avanceHito": 60,
                        "estadoHito": "En Progreso",
                        "responsableHito": "Carmen Ruiz"
                    }
                ]
            },
            {
                "vp": "VP Finanzas",
                "area": "Finanzas",
                "nombreIndicador": "Optimización Costos Operativos",
                "tipoIndicador": "Estratégico",
                "fechaInicioGeneral": date(2024, 1, 1),
                "fechaFinalizacionGeneral": date(2024, 9, 30),
                "responsableGeneral": "Fernando Aguilar",
                "responsableCargaGeneral": "Lucía Hernández",
                "hitos": [
                    {
                        "nombreHito": "Análisis Detallado de Costos",
                        "fechaInicioHito": date(2024, 1, 1),
                        "fechaFinalizacionHito": date(2024, 2, 28),
                        "avanceHito": 100,
                        "estadoHito": "Completado",
                        "responsableHito": "Fernando Aguilar"
                    },
                    {
                        "nombreHito": "Identificación de Oportunidades",
                        "fechaInicioHito": date(2024, 2, 15),
                        "fechaFinalizacionHito": date(2024, 4, 15),
                        "avanceHito": 95,
                        "estadoHito": "En Progreso",
                        "responsableHito": "Lucía Hernández"
                    },
                    {
                        "nombreHito": "Plan de Implementación",
                        "fechaInicioHito": date(2024, 4, 1),
                        "fechaFinalizacionHito": date(2024, 6, 30),
                        "avanceHito": 25,
                        "estadoHito": "En Progreso",
                        "responsableHito": "Miguel Ochoa"
                    }
                ]
            },
            {
                "vp": "VP Marketing",
                "area": "Marketing",
                "nombreIndicador": "Campaña Rebranding 2024",
                "tipoIndicador": "Táctico",
                "fechaInicioGeneral": date(2024, 3, 1),
                "fechaFinalizacionGeneral": date(2024, 8, 31),
                "responsableGeneral": "Patricia Vega",
                "responsableCargaGeneral": "Andrés Molina",
                "hitos": [
                    {
                        "nombreHito": "Investigación de Marca",
                        "fechaInicioHito": date(2024, 3, 1),
                        "fechaFinalizacionHito": date(2024, 4, 15),
                        "avanceHito": 80,
                        "estadoHito": "En Progreso",
                        "responsableHito": "Patricia Vega"
                    },
                    {
                        "nombreHito": "Desarrollo Identidad Visual",
                        "fechaInicioHito": date(2024, 4, 1),
                        "fechaFinalizacionHito": date(2024, 5, 31),
                        "avanceHito": 40,
                        "estadoHito": "En Progreso",
                        "responsableHito": "Andrés Molina"
                    },
                    {
                        "nombreHito": "Lanzamiento Campaña",
                        "fechaInicioHito": date(2024, 6, 1),
                        "fechaFinalizacionHito": date(2024, 8, 31),
                        "avanceHito": 0,
                        "estadoHito": "Pendiente",
                        "responsableHito": "Sofía Delgado"
                    }
                ]
            }
        ]
        
        total_indicadores = 0
        total_hitos = 0
        
        # Crear indicadores y hitos
        for indicador_data in indicadores_ejemplo:
            # Extraer hitos antes de crear indicador
            hitos_data = indicador_data.pop('hitos')
            
            # Crear indicador
            indicador = Indicador(**indicador_data)
            session.add(indicador)
            session.flush()  # Para obtener el ID
            
            total_indicadores += 1
            print(f"✅ Indicador: {indicador.nombreIndicador}")
            
            # Crear hitos
            for hito_data in hitos_data:
                hito_data['indicador_id'] = indicador.id
                hito = Hito(**hito_data)
                session.add(hito)
                total_hitos += 1
                print(f"   📌 Hito: {hito.nombreHito} ({hito.avanceHito}%)")
        
        session.commit()
        
        print(f"\n🎉 ¡DATOS DE EJEMPLO CREADOS!")
        print(f"📊 Total indicadores: {total_indicadores}")
        print(f"🎯 Total hitos: {total_hitos}")
        print(f"🚀 La app ya NO depende de Excel!")
        
        return {
            "status": "created",
            "indicadores": total_indicadores,
            "hitos": total_hitos
        }
        
    except Exception as e:
        print(f"❌ Error: {e}")
        session.rollback()
        return {"status": "error", "message": str(e)}
    finally:
        session.close()

if __name__ == "__main__":
    crear_datos_ejemplo() 