from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.crud.indicador import get_indicadores, get_indicador, create_indicador, update_indicador, delete_indicador, get_indicadores_by_area, get_estadisticas
from app.schemas.indicador import Indicador, IndicadorCreate, IndicadorUpdate

router = APIRouter(
    prefix="/indicadores",
    tags=["indicadores"]
)

@router.post("/", response_model=Indicador)
def create_indicador_endpoint(indicador: IndicadorCreate, db: Session = Depends(get_db)):
    return create_indicador(db, indicador)

@router.get("/", response_model=List[Indicador])
def read_indicadores_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_indicadores(db, skip=skip, limit=limit)

@router.get("/area/{area}", response_model=List[Indicador])
def read_indicadores_by_area(area: str, db: Session = Depends(get_db)):
    return get_indicadores_by_area(db, area=area)

@router.get("/{indicador_id}", response_model=Indicador)
def read_indicador_endpoint(indicador_id: int, db: Session = Depends(get_db)):
    db_indicador = get_indicador(db, indicador_id=indicador_id)
    if db_indicador is None:
        raise HTTPException(status_code=404, detail="Indicador not found")
    return db_indicador

@router.put("/{indicador_id}", response_model=Indicador)
def update_indicador_endpoint(indicador_id: int, indicador: IndicadorUpdate, db: Session = Depends(get_db)):
    db_indicador = update_indicador(db, indicador_id=indicador_id, indicador=indicador)
    if db_indicador is None:
        raise HTTPException(status_code=404, detail="Indicador not found")
    return db_indicador

@router.delete("/{indicador_id}")
def delete_indicador_endpoint(indicador_id: int, db: Session = Depends(get_db)):
    db_indicador = delete_indicador(db, indicador_id=indicador_id)
    if db_indicador is None:
        raise HTTPException(status_code=404, detail="Indicador not found")
    return {"ok": True}

@router.get("/estadisticas/dashboard")
def get_estadisticas_endpoint(db: Session = Depends(get_db)):
    return get_estadisticas(db)

@router.post("/cargar-datos")
def cargar_datos_endpoint():
    """Endpoint para cargar datos de ejemplo profesionales (SIN EXCEL)"""
    try:
        # Importar y ejecutar la función de carga de datos ejemplo
        import sys
        import os
        
        # Agregar directorio padre al path
        parent_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        sys.path.append(parent_dir)
        
        from crear_datos_ejemplo import crear_datos_ejemplo
        
        # Capturar output en variable
        import io
        import contextlib
        
        output_buffer = io.StringIO()
        
        with contextlib.redirect_stdout(output_buffer):
            result = crear_datos_ejemplo()
        
        output = output_buffer.getvalue()
        
        return {
            "success": True,
            "message": "Datos de ejemplo creados correctamente",
            "output": output,
            "data": result
        }
        
    except Exception as e:
        return {
            "success": False,
            "message": f"Error creando datos de ejemplo: {str(e)}"
        } 