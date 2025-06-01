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