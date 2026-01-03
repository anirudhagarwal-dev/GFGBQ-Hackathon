from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas, database

router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)

@router.get("/dashboard", response_model=schemas.DashboardStats)
def get_dashboard_stats(db: Session = Depends(database.get_db)):
    total = db.query(models.Grievance).count()
    open_count = db.query(models.Grievance).filter(models.Grievance.status == models.GrievanceStatus.OPEN).count()
    resolved_count = db.query(models.Grievance).filter(models.Grievance.status == models.GrievanceStatus.RESOLVED).count()
    critical_count = db.query(models.Grievance).filter(models.Grievance.priority == models.Priority.CRITICAL).count()
    
    return {
        "total_grievances": total,
        "open_grievances": open_count,
        "resolved_grievances": resolved_count,
        "critical_grievances": critical_count
    }
