#!/usr/bin/env python3
"""
Script que se ejecuta automáticamente para cargar datos si la BD está vacía
"""

import os
import sys
import pandas as pd
from datetime import datetime
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Agregar el directorio padre al path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import Base
from app.models.indicador import Indicador, Hito

def verificar_y_cargar_datos():
    """Verificar si hay datos y cargar si está vacío"""
    
    # Obtener DATABASE_URL de Railway
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("⚠️ DATABASE_URL no encontrada, usando SQLite local")
        database_url = "sqlite:///./indicadores.db"
    
    # Convertir postgres:// a postgresql:// si es necesario
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    
    engine = create_engine(database_url)
    
    # Crear tablas si no existen
    Base.metadata.create_all(bind=engine)
    
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()
    
    try:
        # Verificar si ya hay datos
        count_indicadores = session.query(Indicador).count()
        print(f"📊 Indicadores existentes: {count_indicadores}")
        
        if count_indicadores > 0:
            print("✅ Ya hay datos en la base. No es necesario cargar.")
            return
        
        print("🔄 Base de datos vacía. Cargando datos automáticamente...")
        
        # Verificar si existe el archivo Excel
        excel_file = 'Base de datos.xlsx'
        if not os.path.exists(excel_file):
            print(f"❌ No se encuentra el archivo {excel_file}")
            return
        
        # Leer y procesar datos
        df = pd.read_excel(excel_file)
        print(f"📋 Datos leídos: {len(df)} filas")
        
        # Procesar datos como en cargar_datos.py
        total_indicadores = 0
        total_hitos = 0
        
        indicadores_grupos = df.groupby('Indicador')
        
        for nombre_indicador, grupo_indicador in indicadores_grupos:
            primera_fila = grupo_indicador.iloc[0]
            
            # Calcular fechas
            fechas_inicio_hitos = grupo_indicador['Fecha de Inicio'].dropna()
            fechas_fin_hitos = grupo_indicador['Fecha Finalizacion'].dropna()
            
            fecha_inicio_general = fechas_inicio_hitos.min() if not fechas_inicio_hitos.empty else primera_fila['Fecha de Inicio']
            fecha_fin_general = fechas_fin_hitos.max() if not fechas_fin_hitos.empty else primera_fila['Fecha Finalizacion']
            
            # Crear indicador
            indicador = Indicador(
                vp=primera_fila['VP'],
                area=primera_fila['Area'],
                nombreIndicador=nombre_indicador,
                tipoIndicador=primera_fila['Tipo Indicador'],
                fechaInicioGeneral=convertir_fecha(fecha_inicio_general),
                fechaFinalizacionGeneral=convertir_fecha(fecha_fin_general),
                responsableGeneral=primera_fila['Responsable'],
                responsableCargaGeneral=primera_fila['Responsable de Carga']
            )
            
            session.add(indicador)
            session.flush()
            
            # Crear hitos
            for _, fila_hito in grupo_indicador.iterrows():
                hito = Hito(
                    indicador_id=indicador.id,
                    nombreHito=fila_hito['Hito'],
                    fechaInicioHito=convertir_fecha(fila_hito['Fecha de Inicio']) or convertir_fecha(fecha_inicio_general),
                    fechaFinalizacionHito=convertir_fecha(fila_hito['Fecha Finalizacion']) or convertir_fecha(fecha_fin_general),
                    avanceHito=int(fila_hito.get('Avance (%)', 0)),
                    estadoHito=fila_hito['Estado'],
                    responsableHito=fila_hito['Responsable']
                )
                
                session.add(hito)
                total_hitos += 1
            
            total_indicadores += 1
        
        session.commit()
        
        print(f"🎉 DATOS CARGADOS AUTOMÁTICAMENTE!")
        print(f"📊 Total indicadores: {total_indicadores}")
        print(f"🎯 Total hitos: {total_hitos}")
        
    except Exception as e:
        print(f"❌ Error cargando datos: {e}")
        session.rollback()
    finally:
        session.close()

def convertir_fecha(fecha_valor):
    """Convertir fecha de Excel a date"""
    if pd.isna(fecha_valor):
        return None
    
    if isinstance(fecha_valor, str):
        if '1900' in fecha_valor:
            return datetime.strptime('2025-12-31', '%Y-%m-%d').date()
        try:
            return datetime.strptime(fecha_valor, '%Y-%m-%d').date()
        except:
            return None
    
    if hasattr(fecha_valor, 'date'):
        return fecha_valor.date()
    
    return fecha_valor

if __name__ == "__main__":
    verificar_y_cargar_datos() 