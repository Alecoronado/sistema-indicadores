#!/usr/bin/env python3
"""
Script para cargar DATOS REALES de la organización
Datos extraídos del Excel original - NO ficticios
"""

import os
import sys
from datetime import datetime, date
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

def convertir_fecha_string(fecha_str):
    """Convertir string de fecha a objeto date"""
    if not fecha_str or fecha_str == 'None':
        return None
    try:
        return datetime.strptime(fecha_str, '%Y-%m-%d').date()
    except:
        return None

def cargar_datos_reales():
    """Cargar datos REALES de la organización"""
    
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
            print(f"✅ Ya existen {count} indicadores. No se cargarán datos nuevos.")
            return {"status": "existing", "count": count}
        
        print("🚀 Cargando DATOS REALES de la organización...")
        
        # DATOS REALES EXTRAÍDOS DEL EXCEL
        indicadores_reales = [
            {
                "vp": "VPD",
                "area": "Alianza Estratégica",
                "nombreIndicador": "Acreditación gestión de recursos GCF",
                "tipoIndicador": "Gestion",
                "fechaInicioGeneral": convertir_fecha_string("2025-01-01"),
                "fechaFinalizacionGeneral": convertir_fecha_string("2025-11-30"),
                "responsableGeneral": "Claudia Gutierrez",
                "responsableCargaGeneral": "Rafael Ranieri",
                "hitos": [
                    {
                        "nombreHito": "Formalización del interés en iniciar proceso",
                        "fechaInicioHito": convertir_fecha_string("2025-01-01"),
                        "fechaFinalizacionHito": convertir_fecha_string("2025-11-30"),
                        "avanceHito": 100,
                        "estadoHito": "Completado",
                        "responsableHito": "Claudia Gutierrez"
                    },
                    {
                        "nombreHito": "Revisión procedimiento para Green Climate Fund (GCF)",
                        "fechaInicioHito": convertir_fecha_string("2025-01-01"),
                        "fechaFinalizacionHito": convertir_fecha_string("2025-10-31"),
                        "avanceHito": 10,
                        "estadoHito": "En Progreso",
                        "responsableHito": "Claudia Gutierrez"
                    },
                    {
                        "nombreHito": "Auto-evaluación GCF",
                        "fechaInicioHito": convertir_fecha_string("2025-01-01"),
                        "fechaFinalizacionHito": convertir_fecha_string("2025-04-18"),
                        "avanceHito": 10,
                        "estadoHito": "En Progreso",
                        "responsableHito": "Claudia Gutierrez"
                    },
                    {
                        "nombreHito": "Versión final presentada al DEJ para consideración",
                        "fechaInicioHito": convertir_fecha_string("2025-01-01"),
                        "fechaFinalizacionHito": convertir_fecha_string("2025-03-27"),
                        "avanceHito": 5,
                        "estadoHito": "En Progreso",
                        "responsableHito": "Claudia Gutierrez"
                    }
                ]
            },
            {
                "vp": "VPD",
                "area": "Alianza Estratégica",
                "nombreIndicador": "Acreditación gestión de recursos UE",
                "tipoIndicador": "Gestion",
                "fechaInicioGeneral": convertir_fecha_string("2025-01-01"),
                "fechaFinalizacionGeneral": convertir_fecha_string("2025-12-31"),
                "responsableGeneral": "Claudia Gutierrez",
                "responsableCargaGeneral": "Rafael Ranieri",
                "hitos": [
                    {
                        "nombreHito": "Revisión procedimiento para EU Pilar Assessment",
                        "fechaInicioHito": convertir_fecha_string("2025-01-01"),
                        "fechaFinalizacionHito": convertir_fecha_string("2025-11-30"),
                        "avanceHito": 100,
                        "estadoHito": "Completado",
                        "responsableHito": "Claudia Gutierrez"
                    },
                    {
                        "nombreHito": "Auto-evaluación EU Pilar Assessment",
                        "fechaInicioHito": convertir_fecha_string("2025-01-01"),
                        "fechaFinalizacionHito": convertir_fecha_string("2025-12-05"),
                        "avanceHito": 0,
                        "estadoHito": "Por Comenzar",
                        "responsableHito": "Claudia Gutierrez"
                    },
                    {
                        "nombreHito": "Formalización del interés en iniciar proceso",
                        "fechaInicioHito": convertir_fecha_string("2025-01-01"),
                        "fechaFinalizacionHito": convertir_fecha_string("2025-12-31"),
                        "avanceHito": 0,
                        "estadoHito": "Por Comenzar",
                        "responsableHito": "Claudia Gutierrez"
                    },
                    {
                        "nombreHito": "Inicio formal de la implementación del proceso de acreditación",
                        "fechaInicioHito": convertir_fecha_string("2025-01-01"),
                        "fechaFinalizacionHito": convertir_fecha_string("2025-03-27"),
                        "avanceHito": 0,
                        "estadoHito": "Por Comenzar",
                        "responsableHito": "Claudia Gutierrez"
                    }
                ]
            },
            {
                "vp": "VPE",
                "area": "Talento Humano",
                "nombreIndicador": "Análisis de propuesta de valor y escalas salariales",
                "tipoIndicador": "Estratégico",
                "fechaInicioGeneral": convertir_fecha_string("2025-01-01"),
                "fechaFinalizacionGeneral": convertir_fecha_string("2025-12-31"),
                "responsableGeneral": "Angel Torres",
                "responsableCargaGeneral": "Angel Torres",
                "hitos": [
                    {
                        "nombreHito": "Actualización de Política de Recursos Humanos",
                        "fechaInicioHito": convertir_fecha_string("2025-01-01"),
                        "fechaFinalizacionHito": convertir_fecha_string("2025-12-31"),
                        "avanceHito": 100,
                        "estadoHito": "En Progreso",
                        "responsableHito": "Angel Torres"
                    },
                    {
                        "nombreHito": "Sociabilización e implementación",
                        "fechaInicioHito": convertir_fecha_string("2025-01-01"),
                        "fechaFinalizacionHito": convertir_fecha_string("2025-12-31"),
                        "avanceHito": 50,
                        "estadoHito": "En Progreso",
                        "responsableHito": "Angel Torres"
                    },
                    {
                        "nombreHito": "Actualización de Manual y Reglamentos",
                        "fechaInicioHito": convertir_fecha_string("2025-01-01"),
                        "fechaFinalizacionHito": convertir_fecha_string("2025-12-31"),
                        "avanceHito": 0,
                        "estadoHito": "En Progreso",
                        "responsableHito": "Angel Torres"
                    },
                    {
                        "nombreHito": "Contratación de consultoría",
                        "fechaInicioHito": convertir_fecha_string("2025-01-01"),
                        "fechaFinalizacionHito": convertir_fecha_string("2025-12-31"),
                        "avanceHito": 30,
                        "estadoHito": "En Progreso",
                        "responsableHito": "Angel Torres"
                    },
                    {
                        "nombreHito": "Aprobación de productos",
                        "fechaInicioHito": convertir_fecha_string("2025-01-01"),
                        "fechaFinalizacionHito": convertir_fecha_string("2025-12-31"),
                        "avanceHito": 0,
                        "estadoHito": "En Progreso",
                        "responsableHito": "Angel Torres"
                    },
                    {
                        "nombreHito": "Implementación y sociabilización",
                        "fechaInicioHito": convertir_fecha_string("2025-01-01"),
                        "fechaFinalizacionHito": convertir_fecha_string("2025-12-31"),
                        "avanceHito": 0,
                        "estadoHito": "En Progreso",
                        "responsableHito": "Angel Torres"
                    }
                ]
            },
            {
                "vp": "VPD",
                "area": "Efectividad y Desarrollo",
                "nombreIndicador": "Aumento de Capital Suscripto",
                "tipoIndicador": "Estratégico",
                "fechaInicioGeneral": convertir_fecha_string("2025-01-01"),
                "fechaFinalizacionGeneral": convertir_fecha_string("2025-06-09"),
                "responsableGeneral": "Rafael Ranieri",
                "responsableCargaGeneral": "Rafael Ranieri",
                "hitos": [
                    {
                        "nombreHito": "Versión final para revisión interna",
                        "fechaInicioHito": convertir_fecha_string("2025-01-01"),
                        "fechaFinalizacionHito": convertir_fecha_string("2025-04-16"),
                        "avanceHito": 100,
                        "estadoHito": "Completado",
                        "responsableHito": "Rafael Ranieri"
                    },
                    {
                        "nombreHito": "Versión final para consideración interna",
                        "fechaInicioHito": convertir_fecha_string("2025-01-01"),
                        "fechaFinalizacionHito": convertir_fecha_string("2025-04-22"),
                        "avanceHito": 100,
                        "estadoHito": "Completado",
                        "responsableHito": "Rafael Ranieri"
                    },
                    {
                        "nombreHito": "Versión final presentada al DEJ para consideración",
                        "fechaInicioHito": convertir_fecha_string("2025-01-01"),
                        "fechaFinalizacionHito": convertir_fecha_string("2025-06-09"),
                        "avanceHito": 100,
                        "estadoHito": "Completado",
                        "responsableHito": "Rafael Ranieri"
                    },
                    {
                        "nombreHito": "Recabar feedback DEJ y AG",
                        "fechaInicioHito": convertir_fecha_string("2025-01-01"),
                        "fechaFinalizacionHito": convertir_fecha_string("2025-03-31"),
                        "avanceHito": 80,
                        "estadoHito": "En Progreso",
                        "responsableHito": "Rafael Ranieri"
                    },
                    {
                        "nombreHito": "Considerar afinamientos con base en benchmarking actualizado",
                        "fechaInicioHito": convertir_fecha_string("2025-01-01"),
                        "fechaFinalizacionHito": convertir_fecha_string("2025-03-31"),
                        "avanceHito": 80,
                        "estadoHito": "En Progreso",
                        "responsableHito": "Rafael Ranieri"
                    },
                    {
                        "nombreHito": "Desarrollar criterios y escenarios para flexibilidad en el cronograma de pago",
                        "fechaInicioHito": convertir_fecha_string("2025-01-01"),
                        "fechaFinalizacionHito": convertir_fecha_string("2025-03-31"),
                        "avanceHito": 80,
                        "estadoHito": "En Progreso",
                        "responsableHito": "Rafael Ranieri"
                    }
                ]
            },
            {
                "vp": "VPE",
                "area": "Talento Humano",
                "nombreIndicador": "Nueva Estrategia Institucional",
                "tipoIndicador": "Estratégico",
                "fechaInicioGeneral": convertir_fecha_string("2025-01-01"),
                "fechaFinalizacionGeneral": convertir_fecha_string("2025-12-31"),
                "responsableGeneral": "Angel Torres",
                "responsableCargaGeneral": "Angel Torres",
                "hitos": [
                    {
                        "nombreHito": "Consultoría para desarrollo de nueva estrategia",
                        "fechaInicioHito": convertir_fecha_string("2025-01-01"),
                        "fechaFinalizacionHito": convertir_fecha_string("2025-12-31"),
                        "avanceHito": 90,
                        "estadoHito": "En Progreso",
                        "responsableHito": "Angel Torres"
                    },
                    {
                        "nombreHito": "Socialización e implementación",
                        "fechaInicioHito": convertir_fecha_string("2025-01-01"),
                        "fechaFinalizacionHito": convertir_fecha_string("2025-12-31"),
                        "avanceHito": 10,
                        "estadoHito": "En Progreso",
                        "responsableHito": "Angel Torres"
                    }
                ]
            }
        ]
        
        total_indicadores = 0
        total_hitos = 0
        
        # Crear indicadores y hitos
        for indicador_data in indicadores_reales:
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
        
        print(f"\n🎉 ¡DATOS REALES CARGADOS!")
        print(f"📊 Total indicadores: {total_indicadores}")
        print(f"🎯 Total hitos: {total_hitos}")
        print(f"🏢 Organización: VPD, VPE - Datos originales del Excel")
        
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
    cargar_datos_reales() 