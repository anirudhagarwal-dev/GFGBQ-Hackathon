from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Text, Float, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from .database import Base

class UserRole(str, enum.Enum):
    CITIZEN = "Citizen"
    FIELD_OFFICER = "FieldOfficer"
    ADMIN = "Admin"
    ZONAL_OFFICER = "ZonalOfficer"
    POLICY_MAKER = "PolicyMaker"
    AUDITOR = "Auditor"

class GrievanceStatus(str, enum.Enum):
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"
    CLOSED = "Closed"
    ESCALATED = "Escalated"
    REJECTED = "Rejected"

class Priority(str, enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String, default=UserRole.CITIZEN)
    is_active = Column(Boolean, default=True)
    phone_number = Column(String, nullable=True)

    grievances = relationship("Grievance", back_populates="citizen", foreign_keys="[Grievance.citizen_id]")
    assigned_grievances = relationship("Grievance", back_populates="assignee", foreign_keys="[Grievance.assignee_id]")

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    code = Column(String, unique=True)
    
    grievances = relationship("Grievance", back_populates="department")

class Grievance(Base):
    __tablename__ = "grievances"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    citizen_id = Column(Integer, ForeignKey("users.id"))
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    assignee_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    status = Column(String, default=GrievanceStatus.OPEN)
    priority = Column(String, default=Priority.LOW)
    category = Column(String, nullable=True)
    
    location = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    sentiment_score = Column(Float, nullable=True)
    ai_summary = Column(Text, nullable=True)
    embedding = Column(Text, nullable=True)

    citizen = relationship("User", back_populates="grievances", foreign_keys=[citizen_id])
    assignee = relationship("User", back_populates="assigned_grievances", foreign_keys=[assignee_id])
    department = relationship("Department", back_populates="grievances")
    feedback = relationship("Feedback", uselist=False, back_populates="grievance")

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    grievance_id = Column(Integer, ForeignKey("grievances.id"), unique=True)
    rating = Column(Integer)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    grievance = relationship("Grievance", back_populates="feedback")
