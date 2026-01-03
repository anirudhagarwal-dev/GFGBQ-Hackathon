from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import shutil
import os
import uuid
from .. import models, schemas, database, auth
from ..services.ai_service import AIService

router = APIRouter(
    prefix="/grievance",
    tags=["grievance"]
)

@router.post("/", response_model=schemas.Grievance)
def create_grievance(
    title: str = Form(...),
    description: str = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    image_url = None
    if image:
        file_extension = image.filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = f"backend/uploads/{filename}"
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        
        image_url = f"/uploads/{filename}"

    ai_result = AIService.analyze_grievance(title, description, image_url)
    
    department = db.query(models.Department).filter(models.Department.name == ai_result["category"]).first()
    department_id = department.id if department else None

    db_grievance = models.Grievance(
        title=title,
        description=description,
        image_url=image_url,
        citizen_id=current_user.id,
        department_id=department_id,
        assignee_id=3,
        status=models.GrievanceStatus.OPEN,
        priority=ai_result["priority"],
        category=ai_result["category"],
        sentiment_score=ai_result["sentiment_score"],
        ai_summary=ai_result["ai_summary"]
    )
    
    db.add(db_grievance)
    db.commit()
    db.refresh(db_grievance)
    return db_grievance

@router.post("/{grievance_id}/feedback", response_model=schemas.Feedback)
def create_feedback(grievance_id: int, feedback: schemas.FeedbackCreate, db: Session = Depends(database.get_db)):
    db_grievance = db.query(models.Grievance).filter(models.Grievance.id == grievance_id).first()
    if not db_grievance:
        raise HTTPException(status_code=404, detail="Grievance not found")
    
    if db_grievance.status != models.GrievanceStatus.RESOLVED:
         raise HTTPException(status_code=400, detail="Can only give feedback on resolved grievances")

    db_feedback = models.Feedback(
        grievance_id=grievance_id,
        rating=feedback.rating,
        comment=feedback.comment
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

@router.put("/{grievance_id}/resolve", response_model=schemas.Grievance)
def resolve_grievance(
    grievance_id: int, 
    image: UploadFile = File(None),
    db: Session = Depends(database.get_db)
):
    db_grievance = db.query(models.Grievance).filter(models.Grievance.id == grievance_id).first()
    if not db_grievance:
        raise HTTPException(status_code=404, detail="Grievance not found")
    
    db_grievance.status = models.GrievanceStatus.RESOLVED
    
    if image:
        file_extension = image.filename.split(".")[-1]
        filename = f"resolution-{uuid.uuid4()}.{file_extension}"
        file_path = f"backend/uploads/{filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        db_grievance.description += f"\n\n[Resolution Image]: /uploads/{filename}"

    db.commit()
    db.refresh(db_grievance)
    return db_grievance

@router.get("/assigned/me", response_model=List[schemas.Grievance])
def read_assigned_grievances(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    grievances = db.query(models.Grievance).filter(models.Grievance.assignee_id == current_user.id).all()
    return grievances

@router.get("/my", response_model=List[schemas.Grievance])
def read_my_grievances(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    grievances = db.query(models.Grievance).filter(models.Grievance.citizen_id == current_user.id).all()
    return grievances

@router.get("/{grievance_id}", response_model=schemas.Grievance)
def read_grievance(grievance_id: int, db: Session = Depends(database.get_db)):
    db_grievance = db.query(models.Grievance).filter(models.Grievance.id == grievance_id).first()
    if db_grievance is None:
        raise HTTPException(status_code=404, detail="Grievance not found")
    return db_grievance

@router.get("/", response_model=List[schemas.Grievance])
def read_grievances(
    skip: int = 0, 
    limit: int = 100, 
    status: Optional[str] = None,
    db: Session = Depends(database.get_db)
):
    query = db.query(models.Grievance)
    if status:
        query = query.filter(models.Grievance.status == status)
    
    grievances = query.offset(skip).limit(limit).all()
    return grievances
