from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    CITIZEN = "Citizen"
    FIELD_OFFICER = "FieldOfficer"
    ADMIN = "Admin"
    ZONAL_OFFICER = "ZonalOfficer"
    POLICY_MAKER = "PolicyMaker"
    AUDITOR = "Auditor"

class GrievanceStatus(str, Enum):
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"
    CLOSED = "Closed"
    ESCALATED = "Escalated"
    REJECTED = "Rejected"

class Priority(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"

class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None
    role: UserRole = UserRole.CITIZEN

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class TokenData(BaseModel):
    email: Optional[str] = None

class FeedbackBase(BaseModel):
    rating: int
    comment: Optional[str] = None

class FeedbackCreate(FeedbackBase):
    grievance_id: int

class Feedback(FeedbackBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class GrievanceBase(BaseModel):
    title: str
    description: str
    location: Optional[str] = None
    image_url: Optional[str] = None

class GrievanceCreate(GrievanceBase):
    pass

class Grievance(GrievanceBase):
    id: int
    citizen_id: int
    department_id: Optional[int] = None
    assignee_id: Optional[int] = None
    status: GrievanceStatus
    priority: Priority
    category: Optional[str] = None
    created_at: datetime
    sentiment_score: Optional[float] = None
    ai_summary: Optional[str] = None
    feedback: Optional[Feedback] = None

    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_grievances: int
    open_grievances: int
    resolved_grievances: int
    critical_grievances: int

class DepartmentBase(BaseModel):
    name: str
    code: str

class Department(DepartmentBase):
    id: int

    class Config:
        from_attributes = True
