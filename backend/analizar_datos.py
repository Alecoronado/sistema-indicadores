#!/usr/bin/env python3
"""
Script para analizar los datos reales y verificar congruencia con el frontend
"""

import sys
import os
from collections import Counter

# Agregar el directorio padre al path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.indicador import Indicador, Hito
from app.database import Base, SQLALCHEMY_DATABASE_URL

def crear_session():
    """Crear session de base de datos"""
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return SessionLocal()

def analizar_datos():
    """Analizar los datos cargados"""
    session = crear_session()
    
    print("🔍 ANÁLISIS DE DATOS REALES")
    print("=" * 50)
    
    # Obtener todos los indicadores
    indicadores = session.query(Indicador).all()
    print(f"📊 Total de indicadores: {len(indicadores)}")
    
    # Analizar VPs
    vps_reales = [ind.vp for ind in indicadores if ind.vp]
    vps_contador = Counter(vps_reales)
    print(f"\n🏢 VPs encontrados en datos reales:")
    for vp, count in vps_contador.items():
        print(f"  • {vp}: {count} indicadores")
    
    # Analizar Áreas
    print(f"\n🏗️ Áreas encontradas en datos reales:")
    areas_por_vp_reales = {}
    for ind in indicadores:
        if ind.vp and ind.area:
            if ind.vp not in areas_por_vp_reales:
                areas_por_vp_reales[ind.vp] = set()
            areas_por_vp_reales[ind.vp].add(ind.area)
    
    for vp, areas in areas_por_vp_reales.items():
        print(f"  {vp}:")
        for area in sorted(areas):
            count = len([ind for ind in indicadores if ind.vp == vp and ind.area == area])
            print(f"    - {area}: {count} indicadores")
    
    # Analizar Tipos de Indicador
    tipos_reales = [ind.tipoIndicador for ind in indicadores if ind.tipoIndicador]
    tipos_contador = Counter(tipos_reales)
    print(f"\n📋 Tipos de indicador encontrados:")
    for tipo, count in tipos_contador.items():
        print(f"  • {tipo}: {count} indicadores")
    
    # Verificar fechas
    indicadores_con_fechas = [ind for ind in indicadores if ind.fechaInicioGeneral and ind.fechaFinalizacionGeneral]
    print(f"\n📅 Indicadores con fechas completas: {len(indicadores_con_fechas)}/{len(indicadores)}")
    
    # Verificar responsables
    responsables_general = [ind.responsableGeneral for ind in indicadores if ind.responsableGeneral and ind.responsableGeneral.strip()]
    print(f"\n👥 Indicadores con responsable general: {len(responsables_general)}/{len(indicadores)}")
    
    # Analizar hitos
    total_hitos = session.query(Hito).count()
    print(f"\n🎯 Total de hitos en base de datos: {total_hitos}")
    
    # Estados de hitos (si existen)
    if total_hitos > 0:
        hitos = session.query(Hito).all()
        estados_hitos = [hito.estadoHito for hito in hitos if hito.estadoHito]
        estados_contador = Counter(estados_hitos)
        print(f"📊 Estados de hitos encontrados:")
        for estado, count in estados_contador.items():
            print(f"  • {estado}: {count} hitos")
    
    return {
        'vps_reales': list(vps_contador.keys()),
        'areas_por_vp_reales': {vp: list(areas) for vp, areas in areas_por_vp_reales.items()},
        'tipos_reales': list(tipos_contador.keys()),
        'total_indicadores': len(indicadores),
        'total_hitos': total_hitos
    }

def verificar_congruencia():
    """Verificar congruencia con el frontend"""
    print("\n🔄 VERIFICANDO CONGRUENCIA CON FRONTEND")
    print("=" * 50)
    
    datos_reales = analizar_datos()
    
    # VPs definidos en el frontend
    vps_frontend = ['VPE', 'VPO', 'VPD', 'PRE', 'VPF']
    
    # Áreas definidas en el frontend
    areas_frontend = {
        'VPO': ['Gestión de Cartera y Resultados'],
        'VPF': ['Programación Financiera', 'Reporting', 'Recursos Financieros', 'Back Office'],
        'VPD': ['Alianzas Estratégicas', 'Estudios Económicos', 'Efectividad y Desarrollo'],
        'VPE': ['Talento Humano', 'TI'],
        'PRE': ['Riesgos', 'Legal', 'Comunicación', 'Auditoría']
    }
    
    # Tipos definidos en el frontend
    tipos_frontend = ['Estratégico', 'Regular', 'Operativo']
    
    print("🔍 COMPARACIÓN:")
    print("\n1️⃣ VPs:")
    print(f"   Frontend espera: {vps_frontend}")
    print(f"   Datos reales:    {datos_reales['vps_reales']}")
    
    vps_faltantes = set(datos_reales['vps_reales']) - set(vps_frontend)
    vps_extra_frontend = set(vps_frontend) - set(datos_reales['vps_reales'])
    
    if vps_faltantes:
        print(f"   ⚠️  VPs en datos pero no en frontend: {list(vps_faltantes)}")
    if vps_extra_frontend:
        print(f"   ⚠️  VPs en frontend pero no en datos: {list(vps_extra_frontend)}")
    
    print("\n2️⃣ Tipos de Indicador:")
    print(f"   Frontend espera: {tipos_frontend}")
    print(f"   Datos reales:    {datos_reales['tipos_reales']}")
    
    tipos_faltantes = set(datos_reales['tipos_reales']) - set(tipos_frontend)
    if tipos_faltantes:
        print(f"   ⚠️  Tipos en datos pero no en frontend: {list(tipos_faltantes)}")
    
    print("\n3️⃣ Áreas por VP:")
    for vp in datos_reales['vps_reales']:
        print(f"   {vp}:")
        areas_reales = datos_reales['areas_por_vp_reales'].get(vp, [])
        areas_esperadas = areas_frontend.get(vp, [])
        print(f"     Frontend espera: {areas_esperadas}")
        print(f"     Datos reales:    {areas_reales}")
        
        areas_faltantes = set(areas_reales) - set(areas_esperadas)
        if areas_faltantes:
            print(f"     ⚠️  Áreas en datos pero no en frontend: {list(areas_faltantes)}")

def main():
    """Función principal"""
    try:
        datos = analizar_datos()
        verificar_congruencia()
        
        print(f"\n✅ ANÁLISIS COMPLETADO")
        print("Si hay inconsistencias marcadas con ⚠️, necesitamos actualizar el frontend.")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main()) 