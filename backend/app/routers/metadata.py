from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import database, models, schemas

router = APIRouter(
    prefix="/metadata",
    tags=["metadata"]
)

@router.get("/departments", response_model=List[schemas.Department])
def get_departments(db: Session = Depends(database.get_db)):
    return db.query(models.Department).all()

@router.get("/regions", response_model=List[schemas.Region])
def get_regions(db: Session = Depends(database.get_db)):
    return db.query(models.Region).all()
