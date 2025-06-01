from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class Indicador(Base):
    __tablename__ = "indicadores"

    id = Column(Integer, primary_key=True, index=True)
    vp = Column(String, index=True)
    area = Column(String, index=True)
    nombreIndicador = Column(String, index=True)
    tipoIndicador = Column(String)
    fechaInicioGeneral = Column(DateTime)
    fechaFinalizacionGeneral = Column(DateTime)
    responsableGeneral = Column(String)
    responsableCargaGeneral = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    hitos = relationship("Hito", back_populates="indicador", cascade="all, delete-orphan")

class Hito(Base):
    __tablename__ = "hitos"

    id = Column(Integer, primary_key=True, index=True)
    indicador_id = Column(Integer, ForeignKey("indicadores.id"))
    nombreHito = Column(String)
    fechaInicioHito = Column(DateTime)
    fechaFinalizacionHito = Column(DateTime)
    avanceHito = Column(Float, default=0)
    estadoHito = Column(String)
    responsableHito = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    indicador = relationship("Indicador", back_populates="hitos") 